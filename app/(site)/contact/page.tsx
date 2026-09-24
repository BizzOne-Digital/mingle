import { ArrowRight } from 'lucide-react'
import { contacts, CtaBand, external, PageHero } from '@/components/site'

export const metadata = {
  title: 'Contact',
  description: 'Call, text or WhatsApp The Mingle at +1 913-706-2347, email info@themingle.com or find us on Instagram @TheMingleKC.',
  alternates: { canonical: '/contact' },
}

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let&apos;s make it <em>happen.</em></>} intro="Ready to book or just want to chat? Reach out — we would love to hear about your event." />
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="contact-list">
          {contacts.map(({ label, value, href, Icon }) => (
            <a key={label} href={href} {...external(href)}>
              <span className="label"><Icon size={18} aria-hidden="true" />{label}</span><span className="value">{value}</span><ArrowRight aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
      <CtaBand title={<>Have a date in mind? <em>Send an inquiry.</em></>} />
    </>
  )
}
