import BookingForm from '@/components/booking-form'
import { ContactLinks, PageHero, SectionLabel } from '@/components/site'
import { listPublic } from '@/lib/data'

export const metadata = {
  title: 'Book Your Experience',
  description: 'Send The Mingle your event details — date, guest count, experience and budget — and we will follow up with a custom proposal.',
  alternates: { canonical: '/booking' },
}

export default async function Booking({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [{ service }, services] = await Promise.all([searchParams, listPublic('services')])
  const names = services.map((s) => s.name as string)
  return (
    <>
      <PageHero eyebrow="Booking" title={<>Your event, <em>your way.</em></>} intro="Share a little about what you are planning. We will follow up to talk through your vision, availability and a price plan for your budget." />
      <section className="section-pad booking-layout" style={{ paddingTop: 0 }}>
        <aside className="booking-aside">
          <SectionLabel>How it works</SectionLabel>
          <ol className="lead" style={{ paddingLeft: 20 }}>
            <li>Send your event details.</li>
            <li>We follow up and prepare a custom proposal.</li>
            <li>Once confirmed, we send a secure link for your deposit.</li>
          </ol>
          <SectionLabel>Prefer to talk?</SectionLabel>
          <ContactLinks />
        </aside>
        <BookingForm services={names} defaultService={names.includes(service ?? '') ? service : ''} />
      </section>
    </>
  )
}
