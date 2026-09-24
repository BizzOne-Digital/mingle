import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const COOKIE = 'mingle_admin'
const MAX_AGE = 60 * 60 * 8 // 8 hours

const secret = () => process.env.ADMIN_SESSION_SECRET || ''
const sign = (value: string) => createHmac('sha256', secret()).update(value).digest('base64url')
const same = (a: string, b: string) => timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest())

export function checkCredentials(email: unknown, password: unknown) {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || secret().length < 32) return false
  if (typeof email !== 'string' || typeof password !== 'string') return false
  // Evaluate both so timing does not reveal which one failed.
  return [same(email.trim().toLowerCase(), ADMIN_EMAIL.toLowerCase()), same(password, ADMIN_PASSWORD)].every(Boolean)
}

export async function startSession() {
  const expires = String(Date.now() + MAX_AGE * 1000)
  const jar = await cookies()
  jar.set(COOKIE, `${expires}.${sign(expires)}`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE })
}

export async function endSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function isAdmin() {
  if (secret().length < 32) return false
  const token = (await cookies()).get(COOKIE)?.value
  const [expires, signature] = token?.split('.') ?? []
  if (!expires || !signature || Number(expires) < Date.now()) return false
  return same(signature, sign(expires))
}

export const ok = (body: Record<string, unknown> = {}, status = 200) => NextResponse.json({ success: true, ...body }, { status })
export const fail = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status })
export const unauthorized = () => fail('Unauthorized', 401)

// ponytail: in-memory limiter is per serverless instance; move to Redis/Upstash if abuse gets past it.
const hits = new Map<string, number[]>()
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > max
}

export const clientIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
