import Link from 'next/link'
import { AudienceBand, PageHead } from '@/components/site'
import { getSettings, listPublic } from '@/lib/data'

export const metadata = {
  title: 'Pricing',
  description: 'Most curated carts from The Mingle start at approximately $800 plus supplies, with a price plan customized around your budget.',
  alternates: { canonical: '/pricing' },
}

export default async function Pricing() {
  const [settings, services] = await Promise.all([getSettings(), listPublic('services')])
  const priced = services.filter((s) => s.startingPrice)
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
      {priced.length > 0 && (
        <section>
          <div className="section-head" style={{ paddingTop: 0 }}><div><p className="section-label">By experience</p><h2>Starting points</h2></div></div>
          <ul className="includes-list single">{priced.map((s) => <li key={s._id ?? s.slug}><Link href={`/services/${s.slug}`}><strong>{s.name}</strong> — {s.startingPrice}</Link></li>)}</ul>
        </section>
      )}
      <div className="actions center" style={{ justifyContent: 'center', margin: '32px 0 0' }}><Link className="btn-pink" href="/booking">Request a custom proposal</Link><Link className="btn-outline" href="/contact">Talk to us</Link></div>
      <AudienceBand />
    </>
  )
}
