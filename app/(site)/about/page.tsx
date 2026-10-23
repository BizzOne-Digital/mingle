import Image from 'next/image'
import Link from 'next/link'
import { Check, Flower2, Gift, Heart, MapPin, Sofa, Sparkles, Star, Target, Users } from 'lucide-react'
import { Accent, BookCta, Img, Paragraphs } from '@/components/site'
import { getSettings, listGallery, listPublic } from '@/lib/data'
import { audiences, defaultImages, offerings } from '@/lib/site'

export const metadata = {
  title: 'About Us',
  description: 'The Mingle creates beautiful curated carts for food and games, build-your-own takeaway bags, the Bliss Bar and the Petal Passion flower bar for events in Kansas City.',
  alternates: { canonical: '/about' },
}

const icons = [Sofa, Target, Gift, Flower2]

// Flow: wide banner photo → intro → what makes it special (offerings) → perfect for → gallery mosaic
// → what we specialize in + client quote → Meet Leslie → booking CTA. Text and photos: Admin → Pages → About, Offerings, Gallery, Testimonials.
export default async function About() {
  const [settings, services, gallery, testimonials] = await Promise.all([getSettings(), listPublic('services'), listGallery(), listPublic('testimonials', { active: true }, 1)])
  const [intro, ...story] = settings.aboutText.split(/\n\s*\n/)
  const quote = testimonials[0]
  return (
    <>
      <div className="about-banner"><Img src={settings.aboutImage} fallback={defaultImages.aboutImage} alt="A curated Mingle event vignette" sizes="(max-width: 1120px) 100vw, 1072px" priority /></div>
      <section className="hero about-hero" aria-labelledby="about-title">
        <div className="hero-copy">
          <p className="section-label">About The Mingle</p>
          <h1 id="about-title">{settings.aboutTitle}</h1>
          <p className="lead">{intro}</p>
          <div className="actions"><Link className="btn-pink" href="/booking">Book your date →</Link></div>
          <ul className="about-chips">
            <li><MapPin size={16} aria-hidden="true" />Kansas City area</li>
            <li><Heart size={16} aria-hidden="true" />Fully curated</li>
            <li><Users size={16} aria-hidden="true" />Interactive</li>
          </ul>
        </div>
      </section>

      {services.length > 0 && (
        <section aria-labelledby="special-title">
          <p className="rule-label" id="special-title">What makes it special</p>
          <div className="special-grid">
            {services.slice(0, 4).map((s, i) => {
              const Icon = icons[i % icons.length]
              return (
                <Link key={s.slug} href={`/offerings/${s.slug}`} className="special-item">
                  <span className="special-icon"><Icon size={30} aria-hidden="true" /></span>
                  <h2>{s.name}</h2>
                  <p>{s.description}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="perfect-title" className="perfect-for">
        <p className="rule-label" id="perfect-title">Perfect for</p>
        <ul className="pill-list">{audiences.map((a) => <li key={a}><Sparkles size={16} aria-hidden="true" />{a}</li>)}</ul>
      </section>

      {gallery.length > 0 && (
        <section aria-labelledby="action-title">
          <div className="section-head"><p className="section-label" id="action-title">See it in action</p><Link className="text-link" href="/gallery">View the gallery →</Link></div>
          <div className="mosaic">
            {gallery.slice(0, 5).map((g, i) => <Link key={g.url} href="/gallery" className="mosaic-tile"><Image src={g.url} alt={`The Mingle event photo ${i + 1}`} fill sizes={i ? '(max-width: 640px) 50vw, 270px' : '(max-width: 640px) 100vw, 420px'} /></Link>)}
          </div>
        </section>
      )}

      <section className="included-row">
        <div className="included-card">
          <h2>What we specialize in</h2>
          <ul>{offerings.map((o) => <li key={o}><span><Check size={13} aria-hidden="true" /></span>{o}</li>)}</ul>
        </div>
        <figure className="about-testimonial">
          <div className="about-testimonial-photo">
            {quote?.image ? <Img src={quote.image} fallback={defaultImages.aboutImage} alt="" sizes="160px" /> : <span aria-hidden="true">“</span>}
          </div>
          <div>
            {quote && <p className="stars" aria-label="5 stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} fill="currentColor" aria-hidden="true" />)}</p>}
            <blockquote>“{quote ? quote.text : <Accent text={settings.aboutQuote} />}”</blockquote>
            {quote && <figcaption>— {quote.name}{quote.eventType && <span>{quote.eventType}</span>}</figcaption>}
          </div>
        </figure>
      </section>

      {/* Meet Leslie — every part editable in Admin → Pages & text → About. The rest of the About story sits with it. */}
      <section className={`leslie${settings.leslieImage ? '' : ' no-photo'}`} aria-labelledby="leslie-title">
        {settings.leslieImage && <div className="leslie-photo"><Img natural src={settings.leslieImage} fallback={defaultImages.aboutImage} alt="Leslie Allison, founder of The Mingle" sizes="(max-width: 860px) 100vw, 420px" /></div>}
        <div className="leslie-body">
          <p className="kicker">{settings.leslieLabel}</p>
          <h2 id="leslie-title"><Accent text={settings.leslieTitle} /></h2>
          <div className="about-body"><Paragraphs text={settings.leslieText} />{story.length > 0 && <Paragraphs text={story.join('\n\n')} />}</div>
          <Link className="btn-pink" href="/contact">Let&apos;s connect</Link>
        </div>
      </section>
      <BookCta />
    </>
  )
}
