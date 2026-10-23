import Link from 'next/link'
import { Accent, BookCta, Img, PageHead } from '@/components/site'
import { getSettings } from '@/lib/data'
import { defaultImages } from '@/lib/site'

export const metadata = {
  title: 'Pricing',
  description: 'The Mingle pricing: carts, Petal Passion, Sleepy Tee Pees, 360 video station, Fun & Games, A Little Romance and Sitting Pretty — customized packages welcome.',
  alternates: { canonical: '/pricing' },
}

export default async function Pricing() {
  const settings = await getSettings()
  // Admin → Pricing → Price list: one "Name | Price" per line.
  const prices = settings.priceList.split('\n').map((l) => l.split('|').map((x) => x.trim())).filter(([name]) => name)
  return (
    <>
      <PageHead image={settings.pricingHeadImage} label="Pricing" title={<Accent text={settings.pricingTitle} />} intro={settings.pricingIntro} />
      <div className="price-cards price-grid">
        {prices.map(([name, price]) => (
          <article key={name}>
            <h2 className="price-name">{name}</h2>
            <p className="price-display">{price}</p>
            <Link className="text-link" href={`/booking?service=${encodeURIComponent(name)}`}>Book this →</Link>
          </article>
        ))}
      </div>
      <p className="price-footnote">{settings.pricingFootnote}</p>
      {/* Editorial feature image — Admin → Pages → "Pricing page — feature image" overrides the default. */}
      <figure className="feature-image">
        <div className="feature-frame"><Img src={settings.pricingImage} fallback={defaultImages.pricingImage} alt="A curated Mingle setup" sizes="(max-width: 1120px) 100vw, 1072px" /></div>
        <figcaption>
          <p className="kicker">Your event, your way</p>
          <p className="feature-quote">{settings.pricingQuote}</p>
          <div className="actions"><Link className="btn-pink" href="/booking">Request a custom proposal</Link><Link className="btn-outline" href="/contact">Talk to us</Link></div>
        </figcaption>
      </figure>
      <BookCta />
    </>
  )
}
