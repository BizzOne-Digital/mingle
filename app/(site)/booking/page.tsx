import BookingForm from '@/components/booking-form'
import { ContactLinks, PageHead } from '@/components/site'
import { listPublic } from '@/lib/data'

export const metadata = {
  title: 'Book Your Experience',
  description: 'Send The Mingle your event details — date, guest count, experience and budget — and we will follow up with a custom proposal.',
  alternates: { canonical: '/booking' },
}

const steps = [
  ['01', 'Send your details', 'Tell us about your event, your guests and the experience you have in mind.'],
  ['02', 'Get your proposal', 'We follow up to talk through your vision and prepare a price plan for your budget.'],
  ['03', 'Secure your date', 'Once your experience is confirmed, we send a secure link to pay your deposit.'],
]

export default async function Booking({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [{ service }, services] = await Promise.all([searchParams, listPublic('services')])
  const names = services.map((s) => s.name as string)
  return (
    <>
      <PageHead center label="Booking" title={<>Your event, <span className="pink">your way.</span></>} intro="Share a little about what you are planning and we will take it from here." />
      <div className="steps" style={{ marginTop: 48 }}>
        {steps.map(([n, title, text]) => <article key={n}><p className="card-num">{n}</p><h2>{title}</h2><p>{text}</p></article>)}
      </div>
      <div className="form-wrap">
        <h2 className="form-title">Book your event</h2>
        <BookingForm services={names} defaultService={names.includes(service ?? '') ? service : ''} />
        <p className="col-title" style={{ textAlign: 'center', marginTop: 40 }}>Prefer to talk?</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}><ContactLinks /></div>
      </div>
    </>
  )
}
