import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Gift, Mail, MessageCircle, Phone, Sofa, Target } from 'lucide-react'
import { audiences, defaultImages, defaultServices, site } from '@/lib/site'
import { resolveImage } from '@/lib/uploads'
import { getSettings } from '@/lib/data'

/** `natural` shows the whole photo at its own proportions (no cropping); otherwise it fills a sized frame. */
export function Img({ src, fallback, alt, sizes, priority, natural }: { src?: string; fallback: string; alt: string; sizes: string; priority?: boolean; natural?: boolean }) {
  const url = resolveImage(src, fallback)
  if (natural) return <Image src={url} alt={alt} width={1600} height={1200} sizes={sizes} priority={priority} style={{ width: '100%', height: 'auto' }} />
  return <Image src={url} alt={alt} fill sizes={sizes} priority={priority} />
}

// A service's own live-site photo when its saved image is missing or legacy.
export const serviceImage = (slug: string) => defaultServices.find((d) => d.slug === slug)?.image ?? defaultImages.introImage

/** Page header on the pink wash. `image` (Admin → Pages → Header image) turns it into the photo hero. `cta` adds an extra link. */
export function PageHead({ label, title, intro, center, cta, image }: { label: string; title: React.ReactNode; intro?: string; center?: boolean; cta?: boolean; image?: string }) {
  // With a photo: the same full-bleed hero as Fun & Games (copy left, photo filling the right and fading into the pink).
  if (image) return (
    <section className="hero page-hero">
      <div className="hero-copy">
        <p className="section-label">{label}</p>
        <h1>{title}</h1>
        {intro && <p className="lead">{intro}</p>}
        <div className="actions"><Link className="btn-pink" href="/booking">Book your date →</Link>{cta && <Link className="btn-outline" href="/contact">Contact us</Link>}</div>
      </div>
      <div className="hero-visual"><div className="hero-main"><Img src={image} fallback={defaultImages.introImage} alt="" sizes="(max-width: 860px) 100vw, 50vw" priority /></div></div>
    </section>
  )
  return (
    <div className={`page-head${center ? ' center' : ''}`}>
      <div className="page-head-copy">
        <p className="section-label">{label}</p>
        <h1>{title}</h1>
        {intro && <p className="lead">{intro}</p>}
        {cta && <div className="actions"><Link className="btn-pink" href="/booking">Book your date →</Link></div>}
      </div>
    </div>
  )
}

/** Closing call to action used at the end of every public page — always links to /booking. */
/** Admin-editable text: *word* → pink accent, | → line break (see the help text in Admin → Pages). */
export function Accent({ text }: { text: string }) {
  return <>{text.split('|').map((line, i) => (
    <Fragment key={i}>{i > 0 && <br />}{line.split('*').map((part, j) => (j % 2 ? <span key={j} className="pink">{part}</span> : part))}</Fragment>
  ))}</>
}

/** Admin-editable text shown one sentence per line (each line, or each sentence when there are no line breaks),
    with colons, exclamation points, dashes and "Goofy Golfer" in pink. */
export function Lines({ text }: { text: string }) {
  const lines = (text.includes('\n') ? text.split(/\n+/) : text.split(/(?<=[.!?])\s+/)).map((l) => l.trim()).filter(Boolean)
  return <>{lines.map((line, i) => (
    <span className="line" key={i}>{line.split(/(Goofy Golfer|[:!—–]|\s-\s)/i).map((part, j) => (j % 2 ? <span key={j} className="pink-mark">{part}</span> : part))}</span>
  ))}</>
}

/** Admin-editable multi-paragraph text (paragraphs separated by a blank line). */
export function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}</>
}

/** Closing call to action used at the end of every public page — always links to /booking. Text: Admin → Pages. */
export async function BookCta() {
  const s = await getSettings()
  return (
    <section className="book-cta" aria-label="Book The Mingle">
      <div className="book-cta-title">
        <h2><Accent text={s.ctaTitle} /></h2>
      </div>
      <p className="lead">{s.ctaText}</p>
      <div className="actions"><Link className="btn-light" href="/booking">Book your date →</Link></div>
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

const cardIcons = [Sofa, Target, Gift]

/** Rounded offering cards: photo with a round icon badge, name, description, "View details". `short` clamps the description to two lines (Home). */
export function ConceptGrid({ services, short }: { services: any[]; short?: boolean }) {
  return (
    <div className={`concepts-grid${short ? ' short' : ''}`}>
      {services.map((s, i) => {
        const Icon = cardIcons[i % cardIcons.length]
        return (
        <Link className="concept-card" key={s._id ?? s.slug} href={`/offerings/${s.slug}`}>
          <div className="card-img"><Img src={s.image} fallback={serviceImage(s.slug)} alt={s.name} sizes="(max-width: 640px) 100vw, (max-width: 860px) 50vw, 360px" /><span className="card-icon"><Icon size={22} aria-hidden="true" /></span></div>
          <div className="card-body">
            <h3 className="card-name">{s.name}</h3>
            <p className="card-desc">{s.description}</p>
            <p className="card-more">View details →</p>
          </div>
        </Link>
        )
      })}
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

export async function Footer() {
  const { footerText } = await getSettings()
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          {/* The logo artwork has a white background, so it sits on a white plate in the dark footer. */}
          <Link href="/" className="footer-logo" aria-label="The Mingle home"><Image src={site.logo} alt="The Mingle" width={190} height={88} /></Link>
          <p className="footer-text">{footerText}</p>
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
