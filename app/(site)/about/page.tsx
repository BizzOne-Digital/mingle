import Link from 'next/link'
import { AudienceBand, ContactLinks, Img } from '@/components/site'
import { getSettings } from '@/lib/data'
import { defaultImages, offerings } from '@/lib/site'

export const metadata = {
  title: 'About Us',
  description: 'The Mingle creates beautiful curated carts for food and games, build-your-own takeaway bags, the Bliss Bar and the Petal Passion flower bar for events in Kansas City.',
  alternates: { canonical: '/about' },
}

// Live-site About layout: wide banner, then story (left) and pull quote + contact (right).
export default async function About() {
  const settings = await getSettings()
  return (
    <>
      <div className="about-banner"><Img src={settings.aboutImage} fallback={defaultImages.aboutImage} alt="A curated Mingle event vignette" sizes="(max-width: 1120px) 100vw, 1072px" priority /></div>
      <div className="about-content">
        <div>
          <p className="section-label" style={{ marginBottom: 12 }}>About The Mingle</p>
          <h1 className="about-title">Experiences your guests take part in</h1>
          <div className="about-body">
            <p>The Mingle creates beautiful curated carts for food and games. Guests can build their own swag bag or takeaway bag at our Bliss Bar, and create their own floral moment at Petal Passion, our flower bar.</p>
            <p>We specialize in fun, creative, interactive and beautiful vignettes — each one curated around your event, your guests and the way you want them to feel.</p>
            <p>The goal is simple: to make your event extra special and absolutely unforgettable.</p>
          </div>
          <p className="col-title">What we specialize in</p>
          <ul className="includes-list single">{offerings.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
        <div>
          <blockquote className="about-quote">“We specialize in fun, creative, interactive and beautiful vignettes to make your event extra special and absolutely <span className="pink">unforgettable.</span>”</blockquote>
          <Link className="btn-pink btn-block" href="/contact" style={{ padding: 16 }}>Let&apos;s connect</Link>
          <p className="col-title">Reach us directly</p>
          <ContactLinks />
          <p className="col-title">Meet the people behind it</p>
          <Link className="text-link" href="/team" style={{ marginTop: 0 }}>Our team →</Link>
        </div>
      </div>
      <AudienceBand />
    </>
  )
}
