import Image from 'next/image'
import Link from 'next/link'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { audiences, defaultImages, nav, site } from '@/lib/site'
import { resolveImage } from '@/lib/uploads'

export function Img({ src, fallback, alt, sizes, priority }: { src?: string; fallback: string; alt: string; sizes: string; priority?: boolean }) {
  return <Image src={resolveImage(src, fallback)} alt={alt} fill sizes={sizes} priority={priority} />
}

/** Live-site page header: left-aligned with a rule (concepts page) or centred (contact page). */
export function PageHead({ label, title, intro, center }: { label: string; title: React.ReactNode; intro?: string; center?: boolean }) {
  return (
    <div className={`page-head${center ? ' center' : ''}`}>
      <p className="section-label">{label}</p>
      <h1>{title}</h1>
      {intro && <p className="lead">{intro}</p>}
    </div>
  )
}

/** The live site's black "Also perfect for" band. */
export function Band({ label, children, cta = true }: { label: string; children: React.ReactNode; cta?: boolean }) {
  return (
    <section className="band">
      <p className="kicker">{label}</p>
      <p>{children}</p>
      {cta && <div className="actions"><Link className="btn-pink" href="/booking">Book your event</Link><Link className="btn-outline" href="/contact">Contact us</Link></div>}
    </section>
  )
}

export function AudienceBand() {
  return <Band label="Also perfect for">{audiences.join(' · ')} · <span className="accent">Celebrations across the Kansas City area</span></Band>
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="actions">
        <a className="btn-outline" href={site.instagramHref} target="_blank" rel="noreferrer">Follow {site.instagram}</a>
        <Link className="btn-pink" href="/booking">Book your event</Link>
      </div>
    </div>
  )
}

/** Live-site concept cards: bordered 3-column grid, tall image, number, name, description, price. */
export function ConceptGrid({ services }: { services: any[] }) {
  return (
    <div className="concepts-grid">
      {services.map((s, i) => (
        <Link className="concept-card" key={s._id ?? s.slug} href={`/services/${s.slug}`}>
          <div className="card-img"><Img src={s.image} fallback={defaultImages.introImage} alt={s.name} sizes="(max-width: 640px) 100vw, (max-width: 860px) 50vw, 360px" /></div>
          <div className="card-body">
            <p className="card-num">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="card-name">{s.name}</h3>
            <p className="card-desc">{s.description}</p>
            {s.startingPrice ? <p className="card-price">{s.startingPrice}</p> : <p className="card-more">Custom quote · View details</p>}
          </div>
        </Link>
      ))}
    </div>
  )
}

// lucide-react ships no brand icons, so Instagram is a small inline glyph.
function InstagramIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
}

export const contacts = [
  { label: 'Call or text', value: site.phone, href: site.phoneHref, cta: 'Call now', Icon: Phone },
  { label: 'WhatsApp', value: site.phone, href: site.whatsappHref, cta: 'Message on WhatsApp', Icon: MessageCircle },
  { label: 'Email', value: site.email, href: site.emailHref, cta: 'Send email', Icon: Mail },
  { label: 'Instagram', value: site.instagram, href: site.instagramHref, cta: 'Follow us', Icon: InstagramIcon },
]
export const external = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

export function ContactLinks({ size = 15 }: { size?: number }) {
  return (
    <ul className="contact-links">
      {contacts.map(({ label, value, href, Icon }) => (
        <li key={label}><a href={href} {...external(href)} aria-label={`${label}: ${value}`}><Icon size={size} aria-hidden="true" /><span>{label === 'WhatsApp' ? `WhatsApp: ${value}` : value}</span></a></li>
      ))}
    </ul>
  )
}

/** Live-site contact cards: icon, label, value, full-width pink button. */
export function ContactCards() {
  return (
    <div className="contact-grid">
      {contacts.map(({ label, value, href, cta, Icon }) => (
        <div className="contact-card" key={label}>
          <Icon size={32} aria-hidden="true" />
          <p className="contact-label">{label}</p>
          <p className="contact-value">{value}</p>
          <a className="btn-pink" href={href} {...external(href)}>{cta}</a>
        </div>
      ))}
    </div>
  )
}

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
        <p className="footer-col-title">Contact The Mingle</p>
        <ContactLinks />
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} The Mingle. All rights reserved.</div>
    </footer>
  )
}
