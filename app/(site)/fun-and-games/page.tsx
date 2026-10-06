import Link from 'next/link'
import { Accent, BookCta, Img, PageHead, serviceImage } from '@/components/site'
import { getOne, getSettings } from '@/lib/data'
import { defaultImages, defaultServices } from '@/lib/site'

export const metadata = {
  title: 'Fun & Games',
  description: 'Curated carts for food and games and interactive stations that get guests mingling, playing and creating together — The Mingle, Kansas City.',
  alternates: { canonical: '/fun-and-games' },
}

// Built only from existing content: the Interactive Experiences and Curated Carts offerings plus the game imagery.
const fallback = (slug: string) => defaultServices.find((d) => d.slug === slug)!

export default async function FunAndGames() {
  const [settings, interactive, carts] = await Promise.all([getSettings(), getOne('services', { slug: 'interactive-experiences' }), getOne('services', { slug: 'curated-carts' })])
  const blocks = [interactive ?? fallback('interactive-experiences'), carts ?? fallback('curated-carts')]
  return (
    <>
      <PageHead label="Fun & Games" title={<Accent text={settings.funTitle} />} intro={settings.funIntro} cta />
      <figure className="feature-image">
        <div className="feature-frame"><Img src={settings.interactiveImage} fallback={defaultImages.interactiveImage} alt="Guests playing a lawn putting game at a Mingle event" sizes="(max-width: 1120px) 100vw, 1072px" priority /></div>
      </figure>
      {blocks.map((s, i) => (
        <section className={`split${i % 2 ? ' reverse' : ''}`} key={s.slug}>
          <div className="split-image"><Img natural src={s.image} fallback={serviceImage(s.slug)} alt={s.name} sizes="(max-width: 640px) 100vw, 536px" /></div>
          <div className="split-body">
            <p className="kicker">{i === 0 ? 'Interactive experiences' : 'Food & games'}</p>
            <h2>{s.name}</h2>
            <p>{s.description}</p>
            <div className="actions"><Link className="btn-pink" href={`/booking?service=${encodeURIComponent(s.name)}`}>Book this experience</Link><Link className="btn-outline" href={`/offerings/${s.slug}`}>View details</Link></div>
          </div>
        </section>
      ))}
      <BookCta />
    </>
  )
}
