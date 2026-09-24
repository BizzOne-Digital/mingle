import { endSession, ok } from '@/lib/auth'

export async function POST() {
  await endSession()
  return ok()
}
