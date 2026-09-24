import { createHmac, timingSafeEqual } from 'node:crypto'

// Stripe hosted Checkout over the REST API — no SDK needed for one call and one webhook.
export async function createDepositCheckout(opts: { inquiryId: string; amountCents: number; email: string; name: string; siteUrl: string }) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
  const body = new URLSearchParams({
    mode: 'payment',
    customer_email: opts.email,
    success_url: `${opts.siteUrl}/booking/deposit?status=success`,
    cancel_url: `${opts.siteUrl}/booking/deposit?status=cancelled`,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': (process.env.STRIPE_CURRENCY || 'usd').toLowerCase(),
    'line_items[0][price_data][unit_amount]': String(opts.amountCents),
    'line_items[0][price_data][product_data][name]': `The Mingle event deposit — ${opts.name}`,
    'metadata[inquiryId]': opts.inquiryId,
    client_reference_id: opts.inquiryId,
  })
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || 'Stripe request failed')
  return { id: json.id as string, url: json.url as string }
}

// Verifies the Stripe-Signature header (t=timestamp,v1=hmac) against the raw request body.
export function verifyStripeSignature(payload: string, header: string | null, secret: string, toleranceSec = 300, now = Date.now()) {
  if (!header || !secret) return false
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=') as [string, string]))
  const t = Number(parts.t)
  const signatures = header.split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3))
  if (!t || !signatures.length || Math.abs(now / 1000 - t) > toleranceSec) return false
  const expected = Buffer.from(createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex'))
  return signatures.some((s) => s.length === expected.length && timingSafeEqual(Buffer.from(s), expected))
}
