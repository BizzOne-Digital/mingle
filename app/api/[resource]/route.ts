import { revalidatePath } from 'next/cache'
import { clean, resources } from '@/lib/content'
import { clientIp, fail, isAdmin, ok, rateLimited, unauthorized } from '@/lib/auth'
import { db, models, toPlain } from '@/lib/db'
import { sendMail } from '@/lib/mail'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ resource: string }> }
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function GET(req: Request, { params }: Ctx) {
  const { resource } = await params
  if (!resources[resource]) return fail('Not found', 404)
  if (!(await isAdmin())) return unauthorized()
  const url = new URL(req.url)
  const filter: Record<string, unknown> = {}
  if (resource === 'inquiries') {
    const status = url.searchParams.get('status')
    const q = url.searchParams.get('q')?.trim().slice(0, 100)
    if (status) filter.status = status
    if (q) filter.$or = ['name', 'email', 'phone', 'eventType', 'service'].map((f) => ({ [f]: { $regex: escapeRegex(q), $options: 'i' } }))
  }
  try {
    await db()
    const items = await models[resource].find(filter).sort(resources[resource].sort).limit(500).lean()
    return ok({ items: toPlain(items) })
  } catch {
    return fail('Database unavailable', 503)
  }
}

export async function POST(req: Request, { params }: Ctx) {
  const { resource } = await params
  const spec = resources[resource]
  if (!spec) return fail('Not found', 404)
  const body = await req.json().catch(() => null)

  if (resource === 'inquiries') {
    // Public booking form: honeypot + per-IP limit + strict validation.
    if (body?.company) return ok({ message: 'Thank you.' }, 201)
    if (rateLimited(`inquiry:${clientIp(req)}`, 5, 10 * 60_000)) return fail('Too many requests. Please try again shortly or call us.', 429)
    const { data, error } = clean(spec.fields, body)
    if (error) return fail(error, 422)
    try {
      await db()
      const item = await models.inquiries.create(data!)
      await sendMail(`New event inquiry — ${data!.name}`, [
        ...spec.fields.map((f): [string, unknown] => [f.label, f.type === 'date' && data![f.name] ? (data![f.name] as Date).toISOString().slice(0, 10) : data![f.name]]),
        ['Admin', `${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/inquiries`],
      ], String(data!.email))
      return ok({ id: String(item._id) }, 201)
    } catch {
      return fail('We could not save your inquiry right now. Please call or email us directly.', 503)
    }
  }

  if (!(await isAdmin())) return unauthorized()
  const { data, error } = clean(spec.fields, body)
  if (error) return fail(error, 422)
  try {
    await db()
    const item = await models[resource].create(data!)
    revalidatePath('/', 'layout')
    return ok({ item: toPlain(item) }, 201)
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return fail('That slug is already in use.', 409)
    return fail('Could not save. Please try again.', 500)
  }
}
