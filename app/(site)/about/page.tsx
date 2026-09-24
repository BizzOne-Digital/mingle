import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CtaBand, Img, PageHero, SectionLabel } from '@/components/site'
import { getSettings } from '@/lib/data'
import { audiences, defaultImages, offerings } from '@/lib/site'

export const metadata = {
  title: 'About Us',
  description: 'The Mingle creates beautiful curated carts for food and games, build-your-own takeaway bags, the Bliss Bar and the Petal Passion flower bar for events in Kansas City.',
  alternates: { canonical: '/about' },
}

export default async function About() {
  const settings = await getSettings()
  return (
    <>
      <PageHero eyebrow="About The Mingle" title={<>Fun, creative and <em>beautifully curated.</em></>} intro="We make events extra special — and absolutely unforgettable." />
      <section className="section-pad split" style={{ paddingTop: 0 }}>
        <div className="image-frame reveal"><Img src={settings.aboutImage} fallback={defaultImages.aboutImage} alt="A curated Mingle event vignette" sizes="(max-width: 900px) 100vw, 50vw" /></div>
        <div className="prose reveal">
          <SectionLabel>Our story</SectionLabel>
          <h2>Experiences your guests <em>take part in.</em></h2>
          <p>The Mingle creates beautiful curated carts for food and games. Guests can build their own swag bag or takeaway bag at our Bliss Bar, and create their own floral moment at Petal Passion, our flower bar.</p>
          <p>We specialize in fun, creative, interactive and beautiful vignettes — each one curated around your event, your guests and the way you want them to feel.</p>
          <p>The goal is simple: to make your event extra special and absolutely unforgettable.</p>
          <div className="actions"><Link className="button button-pink" href="/services">Explore services <ArrowRight size={16} aria-hidden="true" /></Link><Link className="button button-outline" href="/team">Meet our team</Link></div>
        </div>
      </section>
      <section className="section-pad paper">
        <SectionLabel>What we specialize in</SectionLabel>
        <ol className="offer-list">{offerings.map((o, i) => <li key={o}><span>{String(i + 1).padStart(2, '0')}</span>{o}</li>)}</ol>
      </section>
      <section className="section-pad center">
        <SectionLabel>Who we create for</SectionLabel>
        <ul className="audience">{audiences.map((a) => <li key={a}>{a}</li>)}</ul>
        <p className="lead" style={{ marginTop: 30 }}>Serving celebrations across the Kansas City area.</p>
      </section>
      <CtaBand />
    </>
  )
}
