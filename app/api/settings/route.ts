import { revalidatePath } from 'next/cache'
import { clean, imageFields, settingsFields } from '@/lib/content'
import { fail, isAdmin, ok, unauthorized } from '@/lib/auth'
import { db, Setting } from '@/lib/db'
import { deleteRemovedImages } from '@/lib/uploads'

export const runtime = 'nodejs'

const getAll = async () => Object.fromEntries((await Setting.find().lean()).map((r: any) => [r.key, r.value ?? '']))

export async function GET() {
  if (!(await isAdmin())) return unauthorized()
  try {
    await db()
    return ok({ settings: await getAll() })
  } catch {
    return fail('Database unavailable', 503)
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  const { data, error } = clean(settingsFields, await req.json().catch(() => null), true)
  if (error) return fail(error, 422)
  try {
    await db()
    const before = await getAll()
    await Promise.all(Object.entries(data!).map(([key, value]) => Setting.updateOne({ key }, { $set: { value } }, { upsert: true })))
    await deleteRemovedImages(before, { ...before, ...data }, imageFields(settingsFields))
    revalidatePath('/', 'layout')
    return ok({ settings: await getAll() })
  } catch {
    return fail('Could not save settings.', 500)
  }
}
