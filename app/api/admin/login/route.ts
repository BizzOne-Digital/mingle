import { checkCredentials, clientIp, fail, ok, rateLimited, startSession } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (rateLimited(`login:${clientIp(req)}`, 8, 15 * 60_000)) return fail('Too many attempts. Try again in 15 minutes.', 429)
  const body = await req.json().catch(() => null)
  if (!checkCredentials(body?.email, body?.password)) return fail('Incorrect email or password.', 401)
  await startSession()
  return ok()
}
