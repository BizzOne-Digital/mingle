import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react'
import { nav, site } from '@/lib/site'
import { resolveImage } from '@/lib/uploads'

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label"><span aria-hidden="true" />{children}</p>
}

export function Img({ src, fallback, alt, sizes, priority }: { src?: string; fallback: string; alt: string; sizes: string; priority?: boolean }) {
  return <Image src={resolveImage(src, fallback)} alt={alt} fill sizes={sizes} priority={priority} />
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <p className="eyebrow rise">{eyebrow}</p>
      <h1 className="rise rise-2">{title}</h1>
      {intro && <p className="lead rise rise-3">{intro}</p>}
      {children}
    </section>
  )
}

export function CtaBand({ title = <>Let&apos;s make your event <em>unforgettable.</em></>, text = 'Tell us about your event and we will shape an experience around your guests, your vision and your budget.' }: { title?: React.ReactNode; text?: string }) {
  return (
    <section className="cta-band">
      <SectionLabel>Ready when you are</SectionLabel>
      <h2>{title}</h2>
      <p className="lead">{text}</p>
      <div className="actions" style={{ justifyContent: 'center' }}>
        <Link className="button button-pink" href="/booking">Book your experience <ArrowRight size={16} aria-hidden="true" /></Link>
        <Link className="button button-outline" href="/contact">Contact us</Link>
      </div>
    </section>
  )
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="actions" style={{ justifyContent: 'center' }}>
        <a className="button button-outline" href={site.instagramHref} target="_blank" rel="noreferrer">Follow {site.instagram}</a>
        <Link className="button button-pink" href="/booking">Book your experience</Link>
      </div>
    </div>
  )
}

// lucide-react ships no brand icons, so Instagram is a small inline glyph.
function InstagramIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
}

export const contacts = [
  { label: 'Call or text', value: site.phone, href: site.phoneHref, Icon: Phone },
  { label: 'WhatsApp', value: site.phone, href: site.whatsappHref, Icon: MessageCircle },
  { label: 'Email', value: site.email, href: site.emailHref, Icon: Mail },
  { label: 'Instagram', value: site.instagram, href: site.instagramHref, Icon: InstagramIcon },
]
export const external = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

export function ContactLinks({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <ul className={`contact-links ${className}`}>
      {contacts.map(({ label, value, href, Icon }) => (
        <li key={label}><a href={href} {...external(href)} aria-label={`${label}: ${value}`}><Icon size={size} aria-hidden="true" /><span>{label === 'WhatsApp' ? 'WhatsApp' : value}</span></a></li>
      ))}
    </ul>
  )
}

// Mirrors the live the-mingle.com footer: 2px ink rule, brand + two link columns, quiet copyright row.
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Image src={site.logo} alt="The Mingle" width={150} height={69} />
        <p className="footer-text">Unique, curated experiences for your event.</p>
      </div>
      <div>
        <p className="footer-col-title">Explore</p>
        <div className="footer-nav">{[...nav, ['/booking', 'Booking'] as [string, string]].map(([href, label]) => <Link key={href} className="footer-link" href={href}>{label}</Link>)}</div>
      </div>
      <div>
        <p className="footer-col-title">Contact</p>
        <ContactLinks className="footer-contacts" size={15} />
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} The Mingle. All rights reserved.</div>
    </footer>
  )
}
