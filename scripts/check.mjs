// Self-check for validation + Stripe signature logic. Run: node scripts/check.mjs
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { clean, resources } from '../lib/content.ts'
import { verifyStripeSignature } from '../lib/stripe.ts'

const inquiry = resources.inquiries.fields
const good = { name: 'Test Guest', email: 'guest@example.com', phone: '+1 555 010 0000', eventType: 'Grand opening', guestCount: '80', eventDate: '2026-12-01' }

assert.equal(clean(inquiry, good).error, undefined)
assert.equal(clean(inquiry, good).data.guestCount, 80)
assert.match(clean(inquiry, { ...good, email: 'nope' }).error, /email/)
assert.match(clean(inquiry, { ...good, name: '' }).error, /required/)
assert.match(clean(inquiry, { ...good, eventType: 'Rave' }).error, /event type/)
assert.match(clean(inquiry, { ...good, message: 'x'.repeat(3001) }).error, /too long/)
assert.match(clean(inquiry, { ...good, guestCount: '-4' }).error, /number/)
assert.match(clean(inquiry, { ...good, name: { $gt: '' } }).error, /text/) // no operator injection
assert.equal(clean(inquiry, null).error, 'Invalid request body.')

const services = resources.services.fields
assert.match(clean(services, { name: 'X', slug: 'Bad Slug', description: 'd' }).error, /lowercase/)
assert.match(clean(services, { name: 'X', slug: 'x', description: 'd', image: 'https://evil.example/a.png' }).error, /uploaded image/)
assert.equal(clean(services, { name: 'X', slug: 'x', description: 'd', image: '/api/uploads/products/1-a.webp' }).error, undefined)
assert.deepEqual(clean(services, { active: false }, true).data, { active: false }) // partial update keeps only sent fields

const secret = 'whsec_test'
const body = '{"id":"evt_1"}'
const t = Math.floor(Date.now() / 1000)
const sig = createHmac('sha256', secret).update(`${t}.${body}`).digest('hex')
assert.equal(verifyStripeSignature(body, `t=${t},v1=${sig}`, secret), true)
assert.equal(verifyStripeSignature(body + ' ', `t=${t},v1=${sig}`, secret), false)
assert.equal(verifyStripeSignature(body, `t=${t - 1000},v1=${sig}`, secret), false) // replay window
assert.equal(verifyStripeSignature(body, null, secret), false)

console.log('check.mjs: all assertions passed')
