import Image from 'next/image'
import Link from 'next/link'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { audiences, defaultImages, defaultServices, site } from '@/lib/site'
import { resolveImage } from '@/lib/uploads'

/** `natural` shows the whole photo at its own proportions (no cropping); otherwise it fills a sized frame. */
export function Img({ src, fallback, alt, sizes, priority, natural }: { src?: string; fallback: string; alt: string; sizes: string; priority?: boolean; natural?: boolean }) {
  const url = resolveImage(src, fallback)
  if (natural) return <Image src={url} alt={alt} width={1600} height={1200} sizes={sizes} priority={priority} style={{ width: '100%', height: 'auto' }} />
  return <Image src={url} alt={alt} fill sizes={sizes} priority={priority} />
}

// A service's own live-site photo when its saved image is missing or legacy.
export const serviceImage = (slug: string) => defaultServices.find((d) => d.slug === slug)?.image ?? defaultImages.introImage

/** Page header: left-aligned with a rule, or centred. `cta` adds an early "Book your date" link. */
export function PageHead({ label, title, intro, center, cta }: { label: string; title: React.ReactNode; intro?: string; center?: boolean; cta?: boolean }) {
  return (
    <div className={`page-head${center ? ' center' : ''}`}>
      <p className="section-label">{label}</p>
      <h1>{title}</h1>
      {intro && <p className="lead">{intro}</p>}
      {cta && <div className="actions"><Link className="btn-pink" href="/booking">Book your date</Link></div>}
    </div>
  )
}

/** The black "Also perfect for" band (who The Mingle serves). */
export function AudienceBand() {
  return (
    <section className="band">
      <p className="kicker">Also perfect for</p>
      <p>{audiences.join(' · ')} · <span className="accent">Celebrations across the Kansas City area</span></p>
    </section>
  )
}

/** Closing call to action used at the end of every public page — always links to /booking. */
export function BookCta({ title = <>Let&apos;s plan <span className="pink">your day.</span></>, text = 'Tell us about your event and we will shape an experience around your guests, your vision and your budget.' }: { title?: React.ReactNode; text?: string }) {
  return (
    <section className="book-cta" aria-label="Book The Mingle">
      <p className="kicker">Reserve your date</p>
      <h2>{title}</h2>
      <p className="lead">{text}</p>
      <div className="actions"><Link className="btn-pink" href="/booking">Book your date</Link><Link className="btn-outline" href="/contact">Contact us</Link></div>
    </section>
  )
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
        <Link className="concept-card" key={s._id ?? s.slug} href={`/offerings/${s.slug}`}>
          <div className="card-img"><Img src={s.image} fallback={serviceImage(s.slug)} alt={s.name} sizes="(max-width: 640px) 100vw, (max-width: 860px) 50vw, 360px" /></div>
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

/** Offerings strip: two identical sets scroll right → left; translating by exactly -50% makes the loop seamless. */
export function OfferingsMarquee({ items }: { items: string[] }) {
  if (!items.length) return null
  const set = [...items, ...items] // one set is wider than the widest screens, so no gap ever shows
  const row = (key: string) => <ul className="marquee-set" key={key}>{set.map((t, i) => <li key={i}>{t}<span className="marquee-mark">✦</span></li>)}</ul>
  return (
    <section className="marquee" aria-label="Our offerings">
      <p className="sr-only">Our offerings: {items.join(', ')}.</p>
      <div className="marquee-track" aria-hidden="true">{row('a')}{row('b')}</div>
    </section>
  )
}

const footerCols: [string, [string, string][]][] = [
  ['Explore', [['/', 'Home'], ['/about', 'About'], ['/offerings', 'Offerings'], ['/fun-and-games', 'Fun & Games'], ['/gallery', 'Gallery']]],
  ['Plan your event', [['/pricing', 'Pricing'], ['/booking', 'Booking'], ['/faq', 'FAQ'], ['/testimonials', 'Testimonials'], ['/contact', 'Contact']]],
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="wordmark" aria-label="The Mingle home"><span>The</span>Mingle</Link>
          <p className="footer-text">Unique, curated experiences for your event — curated carts, the Bliss Bar, Petal Passion and interactive vignettes that make every celebration unforgettable.</p>
          <Link className="btn-pink" href="/booking">Book your date</Link>
        </div>
        {footerCols.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <p className="footer-col-title">{title}</p>
            <ul className="footer-links">{links.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </nav>
        ))}
        <div>
          <p className="footer-col-title">Get in touch</p>
          <ContactLinks />
          <p className="footer-area">Serving celebrations across the Kansas City area.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} The Mingle. All rights reserved.</p>
        <p><Link href="/privacy">Privacy Policy</Link><span aria-hidden="true">·</span><Link href="/terms">Terms &amp; Conditions</Link></p>
      </div>
    </footer>
  )
}
