import { resources } from './content'
import { db, models, Setting, toPlain } from './db'
import { defaultFaqs, defaultImages, defaultServices } from './site'

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

export async function getBlog(slug: string): Promise<any | null> {
  try {
    await db()
    return toPlain(await models.blogs.findOne({ slug, published: true }).lean())
  } catch {
    return null
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    await db()
    const rows = await Setting.find().lean()
    return { ...defaultImages, ...Object.fromEntries(rows.filter((r: any) => r.value).map((r: any) => [r.key, r.value])) }
  } catch {
    return { ...defaultImages }
  }
}
