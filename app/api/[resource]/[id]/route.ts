import { isValidObjectId } from 'mongoose'
import { revalidatePath } from 'next/cache'
import { clean, imageFields, INQUIRY_STATUSES, resources } from '@/lib/content'
import { fail, isAdmin, ok, unauthorized } from '@/lib/auth'
import { db, models, toPlain } from '@/lib/db'
import { deleteRemovedImages } from '@/lib/uploads'

export const runtime = 'nodejs'

type Ctx = { params: Promise<{ resource: string; id: string }> }

async function guard(params: Ctx['params']) {
  const { resource, id } = await params
  if (!resources[resource] || !isValidObjectId(id)) return { res: fail('Not found', 404) }
  if (!(await isAdmin())) return { res: unauthorized() }
  return { resource, id }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const g = await guard(params)
  if (g.res) return g.res
  const body = await req.json().catch(() => null)
  let data: Record<string, unknown> | undefined
  if (g.resource === 'inquiries') {
    // Admins only change pipeline status; customer-submitted details stay as submitted.
    if (!INQUIRY_STATUSES.includes(body?.status)) return fail('Invalid status', 422)
    data = { status: body.status }
  } else {
    const result = clean(resources[g.resource].fields, body, true)
    if (result.error) return fail(result.error, 422)
    data = result.data
  }
  try {
    await db()
    const model = models[g.resource]
    const before = await model.findById(g.id).lean()
    if (!before) return fail('Not found', 404)
    const item = await model.findByIdAndUpdate(g.id, { $set: data }, { new: true, runValidators: true }).lean()
    await deleteRemovedImages(before as Record<string, unknown>, item as Record<string, unknown>, imageFields(resources[g.resource].fields))
    revalidatePath('/', 'layout')
    return ok({ item: toPlain(item) })
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return fail('That slug is already in use.', 409)
    return fail('Could not save. Please try again.', 500)
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await guard(params)
  if (g.res) return g.res
  try {
    await db()
    const before = await models[g.resource].findByIdAndDelete(g.id).lean()
    if (!before) return fail('Not found', 404)
    await deleteRemovedImages(before as Record<string, unknown>, null, imageFields(resources[g.resource].fields))
    revalidatePath('/', 'layout')
    return ok()
  } catch {
    return fail('Could not delete. Please try again.', 500)
  }
}
