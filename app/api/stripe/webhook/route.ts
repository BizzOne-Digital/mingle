import { db, models } from '@/lib/db'
import { sendMail } from '@/lib/mail'
import { verifyStripeSignature } from '@/lib/stripe'

export const runtime = 'nodejs'

// Stripe → checkout.session.completed marks the deposit paid. Configure this URL in the Stripe dashboard.
export async function POST(req: Request) {
  const payload = await req.text()
  if (!verifyStripeSignature(payload, req.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET || '')) {
    return new Response('Invalid signature', { status: 400 })
  }
  const event = JSON.parse(payload)
  if (event.type === 'checkout.session.completed' && event.data?.object?.payment_status === 'paid') {
    const session = event.data.object
    await db()
    const inquiry = await models.inquiries.findOneAndUpdate(
      { stripeSessionId: session.id },
      { $set: { depositStatus: 'paid', paidAt: new Date() } },
      { new: true },
    )
    if (inquiry) await sendMail(`Deposit paid — ${inquiry.name}`, [['Name', inquiry.name], ['Email', inquiry.email], ['Amount', `$${(session.amount_total / 100).toFixed(2)}`]])
  }
  return Response.json({ received: true })
}
