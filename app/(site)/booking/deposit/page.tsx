import Link from 'next/link'
import { PageHead } from '@/components/site'
import { site } from '@/lib/site'

export const metadata = { title: 'Deposit', robots: { index: false } }

// Stripe Checkout returns here. Payment is confirmed server-side by the webhook, not by this page.
export default async function Deposit({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const paid = status === 'success'
  return (
    <>
      <PageHead
        center
        label="Deposit"
        title={paid ? <>Thank you — your deposit is <span className="pink">on its way.</span></> : <>Your deposit was <span className="pink">not completed.</span></>}
        intro={paid ? 'We will confirm your booking by email as soon as the payment is processed.' : `No payment was taken. Use the link we sent you to try again, or contact us at ${site.phone}.`}
      />
      <div className="actions" style={{ justifyContent: 'center', margin: '32px 0 48px' }}><Link className="btn-pink" href="/">Back to The Mingle</Link><Link className="btn-outline" href="/contact">Contact us</Link></div>
    </>
  )
}
