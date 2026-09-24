import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { UPLOAD_FOLDERS } from '@/lib/content'
import { fail, isAdmin, ok, unauthorized } from '@/lib/auth'
import { db, StoredUpload, toPlain } from '@/lib/db'
import { deleteStoredUpload, parseUploadUrl, replaceImageReferences } from '@/lib/uploads'

export const runtime = 'nodejs'

const MAX_BYTES = 8 * 1024 * 1024
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }

// The browser-supplied type is not trusted: check the file signature too.
function sniff(b: Buffer) {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (b.subarray(0, 4).toString('latin1') === 'GIF8') return 'image/gif'
  if (b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return 'image/webp'
  return null
}

// Upload: FormData { file, folder, replace? }. Binary lives only in MongoDB (StoredUpload), never on disk.
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const folder = String(form?.get('folder') ?? '')
  const replace = form?.get('replace')
  if (!UPLOAD_FOLDERS.includes(folder)) return fail('Invalid folder.', 422)
  if (!(file instanceof File)) return fail('No file received.', 422)
  if (!EXT[file.type]) return fail('Only JPG, PNG, WebP and GIF images are allowed.', 415)
  if (file.size > MAX_BYTES) return fail('Images must be 8MB or smaller.', 413)
  const data = Buffer.from(await file.arrayBuffer())
  if (sniff(data) !== file.type) return fail('The file does not look like a valid image.', 415)
  const filename = `${Date.now()}-${randomBytes(8).toString('hex')}.${EXT[file.type]}`
  try {
    await db()
    await StoredUpload.create({ folder, filename, mimeType: file.type, size: file.size, data })
    const url = `/api/uploads/${folder}/${filename}`
    if (typeof replace === 'string' && parseUploadUrl(replace)) {
      await replaceImageReferences(replace, url)
      await deleteStoredUpload(replace)
      revalidatePath('/', 'layout')
    }
    return ok({ url, filename, size: file.size, folder }, 201)
  } catch {
    return fail('Upload failed. Please try again.', 500)
  }
}

// Media library listing (metadata only, never the binary).
export async function GET(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  const folder = new URL(req.url).searchParams.get('folder')
  try {
    await db()
    const items = await StoredUpload.find(folder && UPLOAD_FOLDERS.includes(folder) ? { folder } : {}).select('-data').sort({ createdAt: -1 }).limit(500).lean()
    return ok({ items: toPlain(items).map((i: any) => ({ ...i, url: `/api/uploads/${i.folder}/${i.filename}` })) })
  } catch {
    return fail('Database unavailable', 503)
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  const url = new URL(req.url).searchParams.get('url')
  if (!parseUploadUrl(url)) return fail('Invalid upload URL.', 422)
  try {
    await db()
    await deleteStoredUpload(url)
    revalidatePath('/', 'layout')
    return ok()
  } catch {
    return fail('Could not delete. Please try again.', 500)
  }
}
