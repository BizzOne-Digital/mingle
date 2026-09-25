import Link from 'next/link'
import { AudienceBand, ConceptGrid, Img } from '@/components/site'
import { getSettings, listPublic } from '@/lib/data'
import { defaultImages, offerings } from '@/lib/site'

export const metadata = { alternates: { canonical: '/' } }

// Section order follows the live the-mingle.com home page: hero → wide image → welcome split → dark band.
export default async function Home() {
  const [settings, services, testimonials] = await Promise.all([getSettings(), listPublic('services', { active: true, featured: true }, 3), listPublic('testimonials', { active: true, featured: true }, 2)])
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <p className="section-label">Curated · Interactive · Unforgettable</p>
        <h1 id="hero-title">Unique, <span className="pink">curated</span><br />experiences for <span className="pink">your event.</span></h1>
        <p className="lead">Beautiful curated carts for food and games, build-your-own takeaway bags, our Bliss Bar and our Petal Passion flower bar — made to make your event extra special.</p>
        <div className="actions"><Link className="btn-pink" href="/booking">Book your event</Link><Link className="btn-outline" href="/services">Explore services</Link></div>
      </section>
      <div className="hero-image"><Img src={settings.heroImage} fallback={defaultImages.heroImage} alt="A beautifully styled Mingle event" sizes="(max-width: 1120px) 100vw, 1072px" priority /></div>
      {settings.heroSecondImage && <div className="home-banner"><Img natural src={settings.heroSecondImage} fallback={defaultImages.heroImage} alt="The Mingle" sizes="(max-width: 1120px) 100vw, 1072px" /></div>}

      <section className="split">
        <div className="split-image"><Img natural src={settings.introImage} fallback={defaultImages.introImage} alt="Guests enjoying a curated Mingle experience" sizes="(max-width: 640px) 100vw, 536px" /></div>
        <div className="split-body">
          <p className="kicker">Welcome to The Mingle</p>
          <h2>Fun. Creative.<br /><span className="pink">Unforgettable.</span></h2>
          <p>We specialize in fun, creative, interactive and beautiful vignettes — curated carts, build-your-own takeaway bags, the Bliss Bar and Petal Passion — to make your event extra special and absolutely unforgettable.</p>
          <p className="tagline">Planning a wedding, a corporate event, a school or church gathering, or a grand opening? Let us make it fun, festive and unforgettable.</p>
          <div className="actions"><Link className="btn-pink" href="/services">See our services</Link><Link className="btn-outline" href="/about">About us</Link></div>
        </div>
      </section>

      <AudienceBand />

      {services.length > 0 && (
        <section>
          <div className="section-head"><div><p className="section-label">Our experiences</p><h2>Choose your experience</h2></div><Link className="text-link" href="/services">All services →</Link></div>
          <ConceptGrid services={services} />
        </section>
      )}

      <section>
        <div className="section-head"><div><p className="section-label">What we bring</p><h2>Curated for your guests</h2></div></div>
        <ul className="includes-list">{offerings.map((o) => <li key={o}>{o}</li>)}</ul>
      </section>

      <section className="split">
        <div className="split-body">
          <p className="kicker">Pricing</p>
          <h2>A thoughtful<br /><span className="pink">starting point.</span></h2>
          <p>Most curated carts start at approximately <strong>{settings.pricingStartingPrice}</strong>. We will customize a price plan for your budget.</p>
          <div className="actions"><Link className="btn-pink" href="/pricing">View pricing</Link><Link className="btn-outline" href="/booking">Request a proposal</Link></div>
        </div>
        <div className="split-image"><Img natural src={settings.pricingImage} fallback={defaultImages.pricingImage} alt="A curated Mingle cart" sizes="(max-width: 640px) 100vw, 536px" /></div>
      </section>

      {testimonials.length > 0 && (
        <section>
          <div className="section-head"><div><p className="section-label">Kind words</p><h2>From our clients</h2></div><Link className="text-link" href="/testimonials">All testimonials →</Link></div>
          <div className="quotes">{testimonials.map((t) => <figure key={t._id}><blockquote className="about-quote">“{t.text}”</blockquote><figcaption>{t.name}{t.eventType && <span> · {t.eventType}</span>}</figcaption></figure>)}</div>
        </section>
      )}
    </>
  )
}
