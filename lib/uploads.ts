import { imageFields, resources, UPLOAD_FOLDERS } from './content'
import { models, Setting, StoredUpload } from './db'

const SAFE_NAME = /^[A-Za-z0-9._-]{1,120}$/

export function parseUploadPath(folder: string, filename: string) {
  if (!UPLOAD_FOLDERS.includes(folder)) return null
  if (!SAFE_NAME.test(filename) || filename.includes('..')) return null
  return { folder, filename }
}

export function parseUploadUrl(url: unknown) {
  if (typeof url !== 'string' || !url.startsWith('/api/uploads/')) return null
  const [folder, filename, ...rest] = url.slice('/api/uploads/'.length).split('/')
  return rest.length ? null : parseUploadPath(folder ?? '', filename ?? '')
}

// Deletes only images stored by our upload system. External and legacy URLs are left alone.
export async function deleteStoredUpload(url: unknown) {
  const ref = parseUploadUrl(url)
  if (ref) await StoredUpload.deleteOne(ref)
}

// Deletes images that a record no longer references after an update or delete.
export async function deleteRemovedImages(before: Record<string, unknown>, after: Record<string, unknown> | null, fields: string[]) {
  await Promise.all(fields.filter((f) => before[f] && before[f] !== after?.[f]).map((f) => deleteStoredUpload(before[f])))
}

// Points every content record at a replacement image (Media library → Replace).
export async function replaceImageReferences(oldUrl: string, newUrl: string) {
  await Promise.all([
    ...Object.entries(resources).flatMap(([key, r]) => imageFields(r.fields).map((f) => models[key].updateMany({ [f]: oldUrl }, { $set: { [f]: newUrl } }))),
    Setting.updateMany({ value: oldUrl }, { $set: { value: newUrl } }),
  ])
}

// Fall back instead of rendering a broken image: legacy /uploads/... files never existed on this deployment,
// and Unsplash stock URLs from the first build may still sit in the database but are no longer an allowed host.
const legacy = (src: string) => src.startsWith('/uploads/') || src.includes('images.unsplash.com')
export const resolveImage = (src: unknown, fallback: string) => (typeof src === 'string' && src && !legacy(src) ? src : fallback)
