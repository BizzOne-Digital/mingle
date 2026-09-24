import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CtaBand, Img, PageHero, SectionLabel } from '@/components/site'
import { getSettings, listPublic } from '@/lib/data'
import { defaultImages } from '@/lib/site'

export const metadata = {
  title: 'Pricing',
  description: 'Most curated carts from The Mingle start at approximately $800 plus supplies, with a price plan customized around your budget.',
  alternates: { canonical: '/pricing' },
}

export default async function Pricing() {
  const [settings, services] = await Promise.all([getSettings(), listPublic('services')])
  const priced = services.filter((s) => s.startingPrice && s.slug !== 'curated-carts')
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>Room to make it <em>personal.</em></>} intro="Every Mingle experience is curated for your event, so every price plan is too." />
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="pricing-steps">
          <article className="reveal">
            <SectionLabel>01 · Starting price</SectionLabel>
            <p className="big">{settings.pricingStartingPrice}</p>
            <p>Most curated carts start at approximately {settings.pricingStartingPrice}.</p>
          </article>
          <article className="reveal">
            <SectionLabel>02 · Customized pricing</SectionLabel>
            <p className="big">Built around your budget</p>
            <p>We will customize a price plan for your budget, shaped by your experience, selections, supplies and guest count.</p>
          </article>
          <article className="reveal">
            <SectionLabel>03 · Final quote</SectionLabel>
            <p className="big">A custom proposal</p>
            <p>Your final quote is confirmed in a custom proposal once we understand your event. Starting prices are not final quotes.</p>
          </article>
        </div>
        {priced.length > 0 && (
          <table className="price-table">
            <caption className="sr-only">Experience starting prices</caption>
            <tbody>{priced.map((s) => <tr key={s._id}><th scope="row">{s.name}</th><td>{s.startingPrice}</td></tr>)}</tbody>
          </table>
        )}
      </section>
      <section className="section-pad paper split">
        <div className="reveal">
          <SectionLabel>Request a proposal</SectionLabel>
          <h2>Tell us your vision and <em>your budget.</em></h2>
          <p className="lead">Share a few details about your event and we will come back with a price plan made for it.</p>
          <div className="actions"><Link className="button button-pink" href="/booking">Request a custom proposal <ArrowRight size={16} aria-hidden="true" /></Link><Link className="button button-outline" href="/contact">Talk to us</Link></div>
        </div>
        <div className="image-frame reveal"><Img src={settings.pricingImage} fallback={defaultImages.pricingImage} alt="A curated Mingle cart" sizes="(max-width: 900px) 100vw, 50vw" /></div>
      </section>
      <CtaBand />
    </>
  )
}
