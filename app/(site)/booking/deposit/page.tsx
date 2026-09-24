import Link from 'next/link'
import { PageHero } from '@/components/site'
import { site } from '@/lib/site'

export const metadata = { title: 'Deposit', robots: { index: false } }

// Stripe Checkout returns here. Payment is confirmed server-side by the webhook, not by this page.
export default async function Deposit({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const paid = status === 'success'
  return (
    <PageHero
      eyebrow="Deposit"
      title={paid ? <>Thank you — your deposit is <em>on its way.</em></> : <>Your deposit was <em>not completed.</em></>}
      intro={paid ? 'We will confirm your booking by email as soon as the payment is processed.' : `No payment was taken. Use the link we sent you to try again, or contact us at ${site.phone}.`}
    >
      <div className="actions" style={{ justifyContent: 'center' }}><Link className="button button-pink" href="/">Back to The Mingle</Link><Link className="button button-outline" href="/contact">Contact us</Link></div>
    </PageHero>
  )
}
