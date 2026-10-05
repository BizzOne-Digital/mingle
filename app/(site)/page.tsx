import Image from 'next/image'
import Link from 'next/link'
import { BookCta, ConceptGrid, Img, OfferingsMarquee } from '@/components/site'
import { getSettings, listGallery, listPublic } from '@/lib/data'
import { resolveImage } from '@/lib/uploads'
import { defaultImages } from '@/lib/site'

export const metadata = { alternates: { canonical: '/' } }

// Flow: hero → offerings strip → welcome → offerings → fun & games → gallery → (testimonials) → booking CTA → footer.
export default async function Home() {
  const [settings, services, testimonials, gallery] = await Promise.all([getSettings(), listPublic('services'), listPublic('testimonials', { active: true, featured: true }, 2), listGallery()])
  const featured = services.filter((s) => s.featured).slice(0, 3)
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="section-label">Curated · Interactive · Unforgettable</p>
          <h1 id="hero-title">Unique, <span className="pink">curated</span> experiences for <span className="pink">your event.</span></h1>
          <p className="lead">Beautiful curated carts for food and games, build-your-own takeaway bags, our Bliss Bar and our Petal Passion flower bar — made to make your event extra special.</p>
          <div className="actions"><Link className="btn-pink" href="/booking">Book your date</Link><Link className="btn-outline" href="/offerings">Explore offerings</Link></div>
          <p className="hero-note">Weddings · Corporate events · Grand openings · Celebrations across Kansas City</p>
        </div>
        <div className="hero-visual">
          <Image src={resolveImage(settings.heroImage, defaultImages.heroImage)} alt="A smiling bride beside The Mingle's Bliss Bar" fill priority sizes="(max-width: 860px) 100vw, 50vw" />
        </div>
      </section>

      <OfferingsMarquee items={services.map((s) => s.name)} />

      {settings.heroSecondImage && <div className="home-banner"><Img natural src={settings.heroSecondImage} fallback={defaultImages.heroImage} alt="The Mingle" sizes="(max-width: 1120px) 100vw, 1072px" /></div>}

      <section className="split">
        <div className="split-image"><Img natural src={settings.introImage} fallback={defaultImages.introImage} alt="A colorful curated Mingle celebration setup" sizes="(max-width: 640px) 100vw, 536px" /></div>
        <div className="split-body">
          <p className="kicker">Welcome to The Mingle</p>
          <h2>Fun. Creative.<br /><span className="pink">Unforgettable.</span></h2>
          <p>We specialize in fun, creative, interactive and beautiful vignettes — curated carts, build-your-own takeaway bags, the Bliss Bar and Petal Passion — to make your event extra special and absolutely unforgettable.</p>
          <p className="tagline">Planning a wedding, a corporate event, a school or church gathering, or a grand opening? Let us make it fun, festive and unforgettable.</p>
          <div className="actions"><Link className="btn-pink" href="/offerings">See our offerings</Link><Link className="btn-outline" href="/about">About us</Link></div>
        </div>
      </section>

      {featured.length > 0 && (
        <section>
          <div className="section-head"><div><p className="section-label">Our offerings</p><h2>Choose your experience</h2></div><Link className="text-link" href="/offerings">All offerings →</Link></div>
          <ConceptGrid services={featured} />
        </section>
      )}

      <section className="split">
        <div className="split-body">
          <p className="kicker">Fun &amp; Games</p>
          <h2>Games your guests<br /><span className="pink">gather around.</span></h2>
          <p>Curated carts for food and games and interactive stations that get guests mingling, playing and creating together — fun by design.</p>
          <div className="actions"><Link className="btn-pink" href="/fun-and-games">Explore Fun &amp; Games</Link><Link className="btn-outline" href="/booking">Book your date</Link></div>
        </div>
        <div className="split-image"><Img natural src={settings.interactiveImage} fallback={defaultImages.interactiveImage} alt="Guests playing a lawn putting game at a Mingle event" sizes="(max-width: 640px) 100vw, 536px" /></div>
      </section>

      {gallery.length > 0 && (
        <section>
          <div className="section-head"><div><p className="section-label">Gallery</p><h2>Moments we have styled</h2></div><Link className="text-link" href="/gallery">View the gallery →</Link></div>
          <div className="gallery-preview">
            {gallery.slice(0, 6).map((g, i) => <Link key={g.url} href="/gallery" className="gallery-tile"><Image src={g.url} alt={`The Mingle event photo ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 340px" /></Link>)}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section>
          <div className="section-head"><div><p className="section-label">Kind words</p><h2>From our clients</h2></div><Link className="text-link" href="/testimonials">All testimonials →</Link></div>
          <div className="quotes">{testimonials.map((t) => <figure key={t._id}><blockquote className="about-quote">“{t.text}”</blockquote><figcaption>{t.name}{t.eventType && <span> · {t.eventType}</span>}</figcaption></figure>)}</div>
        </section>
      )}

      <BookCta />
    </>
  )
}
