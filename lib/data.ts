import { cache } from 'react'
import { resources, settingsDefaults } from './content'
import { db, models, Setting, StoredUpload, toPlain } from './db'
import { defaultFaqs, defaultGallery, defaultImages, defaultServices } from './site'

const seeds: Record<string, unknown[]> = { services: defaultServices, faqs: defaultFaqs }

// Public reads. If MongoDB is unavailable the site still renders confirmed defaults / empty states.
export async function listPublic(resource: string, filter: Record<string, unknown> = { active: true }, limit = 100): Promise<any[]> {
  try {
    await db()
    const model = models[resource]
    // An empty collection is seeded with the confirmed client content so admins can edit it (hide items via "Visible").
    if (seeds[resource] && (await model.estimatedDocumentCount()) === 0) await model.insertMany(seeds[resource]).catch(() => {})
    return toPlain(await model.find(filter).sort(resources[resource].sort).limit(limit).lean())
  } catch {
    const rows = (seeds[resource] ?? []) as Record<string, unknown>[]
    return rows.filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v)).slice(0, limit)
  }
}

export async function getOne(resource: string, filter: Record<string, unknown>): Promise<any | null> {
  try {
    await db()
    return toPlain(await models[resource].findOne(filter).lean())
  } catch {
    const seed = (seeds[resource] ?? []) as Record<string, unknown>[]
    return seed.find((r) => Object.entries(filter).every(([k, v]) => r[k] === v)) ?? null
  }
}

// Gallery = admin uploads in the "gallery" folder (newest first), followed by the client's live-site photos.
export async function listGallery(): Promise<{ url: string; filename: string }[]> {
  try {
    await db()
    const rows = await StoredUpload.find({ folder: 'gallery' }).select('folder filename').sort({ createdAt: -1 }).limit(200).lean()
    const hidden = new Set(String((await Setting.findOne({ key: 'galleryHidden' }).lean() as any)?.value ?? '').split(',').filter(Boolean))
    return [...rows.map((r: any) => ({ url: `/api/uploads/${r.folder}/${r.filename}`, filename: r.filename })), ...defaultGallery.filter((g) => !hidden.has(g.filename))]
  } catch {
    return defaultGallery
  }
}

// Page images + text: built-in defaults, overridden by anything saved in Admin → Pages. Cached per request
// because the layout (footer), page and closing banner all read it.
export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const base = { ...defaultImages, ...settingsDefaults }
  try {
    await db()
    const rows = await Setting.find().lean()
    return { ...base, ...Object.fromEntries(rows.filter((r: any) => r.value).map((r: any) => [r.key, r.value])) }
  } catch {
    return base
  }
})
