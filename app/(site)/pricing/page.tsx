import Link from 'next/link'
import { Accent, BookCta, Img, PageHead } from '@/components/site'
import { getSettings } from '@/lib/data'
import { defaultImages } from '@/lib/site'

export const metadata = {
  title: 'Pricing',
  description: 'The Mingle pricing: curated carts start from $800+ and wedding proposals start from $1,000, with a custom proposal for every event.',
  alternates: { canonical: '/pricing' },
}

export default async function Pricing() {
  const settings = await getSettings()
  return (
    <>
      <PageHead label="Pricing" title={<Accent text={settings.pricingTitle} />} intro={settings.pricingIntro} />
      {/* The only two published prices — both edited in Admin → Pricing. */}
      <div className="price-cards">
        <article>
          <p className="card-num">CURATED CARTS</p>
          <p className="price-from">Starting from</p>
          <p className="price-display">{settings.cartsPrice}</p>
          <Link className="text-link" href="/offerings/curated-carts">View curated carts →</Link>
        </article>
        <article>
          <p className="card-num">WEDDING PROPOSALS</p>
          <p className="price-from">Starting from</p>
          <p className="price-display">{settings.proposalPrice}</p>
          <Link className="text-link" href="/booking">Plan a proposal →</Link>
        </article>
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
