import BookingForm from '@/components/booking-form'
import { ContactCards, PageHead } from '@/components/site'
import { listPublic } from '@/lib/data'

export const metadata = {
  title: 'Contact',
  description: 'Call, text or WhatsApp The Mingle at +1 913-706-2347, email info@themingle.com or find us on Instagram @TheMingleKC.',
  alternates: { canonical: '/contact' },
}

// Live-site contact layout: centred header, contact cards, then "Send a message" form (same backend as /booking).
export default async function Contact() {
  const services = await listPublic('services')
  return (
    <>
      <PageHead center label="Get in touch" title={<>Let&apos;s make it <span className="pink">happen.</span></>} intro="Ready to book or just want to chat? Reach out — we would love to hear from you." />
      <ContactCards />
      <div className="form-wrap">
        <h2 className="form-title">Send a message</h2>
        <BookingForm services={services.map((s) => s.name)} submitLabel="Send message" />
      </div>
    </>
  )
}
