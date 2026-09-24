import { db, StoredUpload } from '@/lib/db'
import { parseUploadPath } from '@/lib/uploads'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await params
  const ref = parseUploadPath(folder, filename)
  if (!ref) return new Response('Not found', { status: 404 })
  try {
    await db()
    const file = await StoredUpload.findOne(ref).lean<{ data: any; mimeType: string }>()
    if (!file) return new Response('Not found', { status: 404 })
    // lean() returns a BSON Binary; its .buffer holds the bytes.
    const bytes: Buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data.buffer)
    return new Response(new Uint8Array(bytes), {
      headers: { 'Content-Type': file.mimeType, 'Content-Length': String(bytes.length), 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' },
    })
  } catch {
    return new Response('Unavailable', { status: 503 })
  }
}
