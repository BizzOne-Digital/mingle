import Link from 'next/link'
import { ArrowRight, MoveUpRight } from 'lucide-react'
import { CtaBand, Img, SectionLabel } from '@/components/site'
import { getSettings, listPublic } from '@/lib/data'
import { audiences, defaultImages, offerings } from '@/lib/site'

export const metadata = { alternates: { canonical: '/' } }

export default async function Home() {
  const [settings, services, testimonials] = await Promise.all([getSettings(), listPublic('services', { active: true, featured: true }, 3), listPublic('testimonials', { active: true, featured: true }, 2)])
  return (
    <>
      <section className="page-hero home-hero" aria-labelledby="hero-title">
        <p className="eyebrow rise">Curated event experiences · Kansas City</p>
        <h1 id="hero-title" className="rise rise-2">Unique, curated experiences<br /><em>for your event.</em></h1>
        <p className="lead rise rise-3">Beautiful curated carts, interactive bars and event vignettes that make your celebration extra special — and absolutely unforgettable.</p>
        <div className="actions rise rise-3">
          <Link className="button button-pink" href="/booking">Book your experience <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link className="button button-outline" href="/services">Explore services <MoveUpRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="hero-image image-frame rise rise-3"><Img src={settings.heroImage} fallback={defaultImages.heroImage} alt="A beautifully styled Mingle event setup" sizes="100vw" priority /></div>
      </section>

      <section className="section-pad split">
        <div className="reveal">
          <SectionLabel>Welcome to The Mingle</SectionLabel>
          <h2>Not just a detail.<br /><em>A moment in the making.</em></h2>
          <p className="lead">The Mingle creates beautiful curated carts for food and games, build-your-own takeaway bags, our Bliss Bar and our Petal Passion flower bar. We specialize in fun, creative, interactive and beautiful vignettes that make your event extra special.</p>
          <Link className="text-link" href="/about">About The Mingle <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="image-frame reveal"><Img src={settings.introImage} fallback={defaultImages.introImage} alt="Guests gathered around a curated Mingle experience" sizes="(max-width: 900px) 100vw, 50vw" /></div>
      </section>

      <section className="section-pad paper">
        <SectionLabel>What we bring</SectionLabel>
        <h2>Curated for the way you<br /><em>want your guests to feel.</em></h2>
        <ol className="offer-list">{offerings.map((o, i) => <li key={o}><span>{String(i + 1).padStart(2, '0')}</span>{o}</li>)}</ol>
      </section>

      {services.length > 0 && (
        <section className="section-pad">
          <div className="section-heading">
            <div><SectionLabel>Signature experiences</SectionLabel><h2>Designed to be <em>remembered.</em></h2></div>
            <p>Every experience is shaped around your event. <Link className="text-link" href="/services">All services <ArrowRight size={16} aria-hidden="true" /></Link></p>
          </div>
          <div className="experience-grid">
            {services.map((s) => (
              <article className="experience-card reveal" key={s._id ?? s.slug}>
                <div className="image-frame"><Img src={s.image} fallback={defaultImages.introImage} alt={s.name} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" /></div>
                <div className="card-body"><h3>{s.name}</h3><p>{s.description}</p></div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="marquee" aria-hidden="true"><div>Curated carts <span>✦</span> Bliss Bar <span>✦</span> Petal Passion <span>✦</span> interactive joy <span>✦</span> curated carts <span>✦</span> Bliss Bar <span>✦</span> Petal Passion <span>✦</span></div></section>

      <section className="section-pad split reverse">
        <div className="reveal">
          <SectionLabel>A thoughtful starting point</SectionLabel>
          <h2>Room to make it <em>personal.</em></h2>
          <p className="lead">Most curated carts start at approximately <strong>{settings.pricingStartingPrice}</strong>. We will customize a price plan around your budget.</p>
          <div className="actions"><Link className="button button-pink" href="/pricing">View pricing <ArrowRight size={16} aria-hidden="true" /></Link><Link className="button button-outline" href="/booking">Request a proposal</Link></div>
        </div>
        <div className="image-frame reveal"><Img src={settings.pricingImage} fallback={defaultImages.pricingImage} alt="A curated Mingle cart" sizes="(max-width: 900px) 100vw, 50vw" /></div>
      </section>

      <section className="section-pad paper center">
        <SectionLabel>Who we create for</SectionLabel>
        <h2>For the brides, the planners<br /><em>and the people who host.</em></h2>
        <ul className="audience">{audiences.map((a) => <li key={a}>{a}</li>)}</ul>
        <p className="lead" style={{ marginTop: 30 }}>Serving celebrations across the Kansas City area.</p>
      </section>

      {testimonials.length > 0 && (
        <section className="section-pad">
          <SectionLabel>Kind words</SectionLabel>
          <div className="quote-grid" style={{ marginTop: 30 }}>{testimonials.map((t) => <figure className="quote" key={t._id}><blockquote>“{t.text}”</blockquote><figcaption>{t.name}{t.eventType && <span> · {t.eventType}</span>}</figcaption></figure>)}</div>
          <Link className="text-link" href="/testimonials">All testimonials <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      )}

      <CtaBand />
    </>
  )
}
