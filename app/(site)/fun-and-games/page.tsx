import Image from 'next/image'
import Link from 'next/link'
import { CalendarHeart, PartyPopper, Sparkles, Wand2 } from 'lucide-react'
import { Accent, BookCta, Img, Lines, serviceImage } from '@/components/site'
import { getOne, getSettings, listGallery } from '@/lib/data'
import { audiences, defaultImages, defaultServices } from '@/lib/site'

export const metadata = {
  title: 'Fun & Games',
  description: 'Curated carts for food and games and interactive stations that get guests mingling, playing and creating together — The Mingle, Kansas City.',
  alternates: { canonical: '/fun-and-games' },
}

// Built from existing content: the Curated Carts offering, the game imagery and the Coming Spring 2027 items (Admin → Pages → Fun & Games).
const fallback = (slug: string) => defaultServices.find((d) => d.slug === slug)!

const steps = [
  { Icon: CalendarHeart, title: 'Tell us about your event', text: 'Share your date, guests and vision through our booking page.' },
  { Icon: Wand2, title: 'We curate the fun', text: 'Games and stations styled around your event and your guests.' },
  { Icon: PartyPopper, title: 'Your guests mingle', text: 'Everyone plays, laughs and creates memories together.' },
]

// Flow: hero (photo) → how it works → curated carts → coming spring 2027 → perfect for → gallery mosaic → booking CTA.
export default async function FunAndGames() {
  const [settings, carts, gallery] = await Promise.all([getSettings(), getOne('services', { slug: 'curated-carts' }), listGallery()])
  const blocks = [carts ?? fallback('curated-carts')]
  const coming = [1, 2, 3].map((n) => ({ name: settings[`comingName${n}`], image: settings[`comingImage${n}`] })).filter((c) => c.name)
  return (
    <>
      <section className="hero fun-hero" aria-labelledby="fun-title">
        <div className="hero-copy">
          <p className="section-label">Fun &amp; Games</p>
          <h1 id="fun-title"><Accent text={settings.funTitle} /></h1>
          <p className="lead lines"><Lines text={settings.funIntro} /></p>
          <div className="actions"><Link className="btn-pink" href="/booking">Book your date →</Link><Link className="btn-outline" href="/offerings">All offerings</Link></div>
        </div>
        <div className="hero-visual">
          <div className="hero-main"><Img src={settings.interactiveImage} fallback={defaultImages.interactiveImage} alt="Guests playing a lawn putting game at a Mingle event" sizes="(max-width: 860px) 100vw, 50vw" priority /></div>
        </div>
      </section>

      <section aria-labelledby="how-title">
        <p className="rule-label" id="how-title">How it works</p>
        <ol className="special-grid steps-3">
          {steps.map(({ Icon, title, text }) => (
            <li key={title} className="special-item">
              <span className="special-icon"><Icon size={30} aria-hidden="true" /></span>
              <h2>{title}</h2>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {blocks.map((s) => (
        <section className="split" key={s.slug}>
          <div className="split-image"><Img natural src={s.image} fallback={serviceImage(s.slug)} alt={s.name} sizes="(max-width: 640px) 100vw, 536px" /></div>
          <div className="split-body">
            <p className="kicker">Food &amp; games</p>
            <h2>{s.name}</h2>
            <p className="lines"><Lines text={s.description} /></p>
            <div className="actions"><Link className="btn-pink" href={`/booking?service=${encodeURIComponent(s.name)}`}>Book this experience</Link><Link className="btn-outline" href={`/offerings/${s.slug}`}>View details</Link></div>
          </div>
        </section>
      ))}

      {coming.length > 0 && (
        <section aria-labelledby="coming-title">
          <div className="section-head center-head"><div><h2 id="coming-title"><Accent text={settings.comingTitle} /></h2></div></div>
          <div className="coming-grid">
            {coming.map((c) => (
              <figure key={c.name} className="coming-card">
                <div className="coming-photo">{c.image ? <Img src={c.image} fallback={defaultImages.interactiveImage} alt={c.name} sizes="(max-width: 640px) 100vw, 340px" /> : <Sparkles size={40} aria-hidden="true" />}</div>
                <figcaption><span>Coming spring 2027</span>{c.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="perfect-title" className="perfect-for">
        <p className="rule-label" id="perfect-title">Perfect for</p>
        <ul className="pill-list">{audiences.map((a) => <li key={a}><Sparkles size={16} aria-hidden="true" />{a}</li>)}</ul>
      </section>

      {gallery.length > 0 && (
        <section aria-labelledby="action-title">
          <div className="section-head"><p className="section-label" id="action-title">See the fun in action</p><Link className="text-link" href="/gallery">View the gallery →</Link></div>
          <div className="mosaic">
            {gallery.slice(0, 5).map((g, i) => <Link key={g.url} href="/gallery" className="mosaic-tile"><Image src={g.url} alt={`The Mingle event photo ${i + 1}`} fill sizes={i ? '(max-width: 640px) 50vw, 270px' : '(max-width: 640px) 100vw, 420px'} /></Link>)}
          </div>
        </section>
      )}

      <BookCta />
    </>
  )
}
