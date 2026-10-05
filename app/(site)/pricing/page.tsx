import Link from 'next/link'
import { BookCta, Img, PageHead } from '@/components/site'
import { getSettings } from '@/lib/data'
import { defaultImages } from '@/lib/site'

export const metadata = {
  title: 'Pricing',
  description: 'Most curated carts from The Mingle start at approximately $800 plus supplies, with a price plan customized around your budget.',
  alternates: { canonical: '/pricing' },
}

export default async function Pricing() {
  const settings = await getSettings()
  return (
    <>
      <PageHead label="Pricing" title="A price plan made for your event" intro="Every Mingle experience is curated for your event, so every price plan is too." />
      <div className="steps" style={{ marginTop: 48 }}>
        <article>
          <p className="card-num">01 · STARTING PRICE</p>
          <p className="price-display">{settings.pricingStartingPrice}</p>
          <p>Most curated carts start at approximately {settings.pricingStartingPrice}.</p>
        </article>
        <article>
          <p className="card-num">02 · CUSTOMIZED PRICING</p>
          <h2>Built around your budget</h2>
          <p>We will customize a price plan for your budget, shaped by your experience, selections, supplies and guest count.</p>
        </article>
        <article>
          <p className="card-num">03 · FINAL QUOTE</p>
          <h2>A custom proposal</h2>
          <p>Your final quote is confirmed in a custom proposal once we understand your event. Starting prices are not final quotes.</p>
        </article>
      </div>
      {/* Editorial feature image — Admin → Pages → "Pricing page — feature image" overrides the default. */}
      <figure className="feature-image">
        <div className="feature-frame"><Img src={settings.pricingImage} fallback={defaultImages.pricingImage} alt="A curated Mingle setup" sizes="(max-width: 1120px) 100vw, 1072px" /></div>
        <figcaption>
          <p className="kicker">Your event, your way</p>
          <p className="feature-quote">Every detail is curated around your guests, your vision and your budget.</p>
          <div className="actions"><Link className="btn-pink" href="/booking">Request a custom proposal</Link><Link className="btn-outline" href="/contact">Talk to us</Link></div>
        </figcaption>
      </figure>
      <BookCta />
    </>
  )
}
