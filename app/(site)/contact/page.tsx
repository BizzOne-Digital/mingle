import BookingForm from '@/components/booking-form'
import { Accent, BookCta, ContactCards, PageHead } from '@/components/site'
import { getSettings, listPublic } from '@/lib/data'

export const metadata = {
  title: 'Contact',
  description: 'Call, text or WhatsApp The Mingle at +1 913-706-2347, email Allisonnow30@gmail.com or find us on Instagram @TheMingleKC.',
  alternates: { canonical: '/contact' },
}

// Live-site contact layout: centred header, contact cards, then "Send a message" form (same backend as /booking).
export default async function Contact() {
  const [services, settings] = await Promise.all([listPublic('services'), getSettings()])
  return (
    <>
      <PageHead center label="Get in touch" title={<Accent text={settings.contactTitle} />} intro={settings.contactIntro} />
      <ContactCards />
      <div className="form-wrap">
        <h2 className="form-title">Send a message</h2>
        <BookingForm services={services.map((s) => s.name)} submitLabel="Send message" />
      </div>
      <BookCta />
    </>
  )
}
