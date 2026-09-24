import { isValidObjectId } from 'mongoose'
import { fail, isAdmin, ok, unauthorized } from '@/lib/auth'
import { db, models, toPlain } from '@/lib/db'
import { site } from '@/lib/site'
import { createDepositCheckout } from '@/lib/stripe'

export const runtime = 'nodejs'

// Admin approves a booking and creates a Stripe Checkout link for the deposit amount they enter.
// Inquiry (new) → admin marks booked → deposit link (requested) → Stripe webhook (paid).
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  const body = await req.json().catch(() => null)
  const amount = Number(body?.amount)
  if (!isValidObjectId(body?.inquiryId)) return fail('Invalid inquiry.', 422)
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) return fail('Enter a deposit amount between $1 and $100,000.', 422)
  if (!process.env.STRIPE_SECRET_KEY) return fail('Payments are not connected yet. Add STRIPE_SECRET_KEY to the environment.', 503)
  try {
    await db()
    const inquiry = await models.inquiries.findById(body.inquiryId)
    if (!inquiry) return fail('Inquiry not found.', 404)
    if (inquiry.depositStatus === 'paid') return fail('This deposit has already been paid.', 409)
    const amountCents = Math.round(amount * 100)
    const session = await createDepositCheckout({ inquiryId: String(inquiry._id), amountCents, email: inquiry.email, name: inquiry.name, siteUrl: site.url })
    inquiry.set({ status: 'booked', depositStatus: 'requested', depositAmount: amountCents, depositUrl: session.url, stripeSessionId: session.id })
    await inquiry.save()
    return ok({ item: toPlain(inquiry) })
  } catch (e) {
    console.error('Deposit link failed:', (e as Error).message)
    return fail('Could not create the deposit link. Check the Stripe configuration.', 502)
  }
}
