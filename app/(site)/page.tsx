import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Accent, BookCta, ConceptGrid, Img, OfferingsMarquee, serviceImage } from '@/components/site'
import { getSettings, listGallery, listPublic } from '@/lib/data'
import { resolveImage } from '@/lib/uploads'
import { defaultImages } from '@/lib/site'

export const metadata = { alternates: { canonical: '/' } }

// Flow: hero (photo + two offering snapshots) → optional banner → offerings → welcome → fun & games banner → gallery → footer (photo strip + pink band).
export default async function Home() {
  const [settings, services, gallery] = await Promise.all([getSettings(), listPublic('services'), listGallery()])
  const featured = services.filter((s) => s.featured).slice(0, 3)
  const snaps = (featured.length ? featured : services).slice(0, 2)
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="section-label">{settings.heroLabel}</p>
          <h1 id="hero-title"><Accent text={settings.heroTitle} /></h1>
          <p className="lead">{settings.heroText}</p>
          <div className="actions"><Link className="btn-pink" href="/booking">Book your date →</Link><Link className="btn-outline" href="/offerings">Explore offerings</Link></div>
          {settings.heroNote && <p className="hero-note">{settings.heroNote}</p>}
        </div>
        <div className="hero-visual">
          <div className="hero-main"><Image src={resolveImage(settings.heroImage, defaultImages.heroImage)} alt="A smiling bride beside The Mingle's Bliss Bar" fill priority sizes="(max-width: 860px) 100vw, 50vw" /></div>
          {snaps.map((s, i) => (
            <Link key={s.slug} href={`/offerings/${s.slug}`} className={`hero-snap snap-${i + 1}`} aria-label={s.name}>
              <Img src={s.image} fallback={serviceImage(s.slug)} alt="" sizes="240px" />
            </Link>
          ))}
        </div>
      </section>

      <OfferingsMarquee items={services.map((s) => s.name)} />

      {settings.heroSecondImage && <div className="home-banner"><Img natural src={settings.heroSecondImage} fallback={defaultImages.heroImage} alt="The Mingle" sizes="(max-width: 1120px) 100vw, 1072px" /></div>}

      {featured.length > 0 && (
        <section>
          <div className="section-head center-head"><div><h2>Offerings</h2></div><Link className="text-link" href="/offerings">All offerings →</Link></div>
          <ConceptGrid services={featured} short />
        </section>
      )}

      <section className="split">
        <div className="split-image"><Img natural src={settings.introImage} fallback={defaultImages.introImage} alt="A colorful curated Mingle celebration setup" sizes="(max-width: 640px) 100vw, 536px" /></div>
        <div className="split-body">
          <p className="kicker">{settings.welcomeLabel}</p>
          <h2><Accent text={settings.welcomeTitle} /></h2>
          <p>{settings.welcomeText}</p>
          <p className="tagline">{settings.welcomeTagline}</p>
          <div className="actions"><Link className="btn-pink" href="/about">About us →</Link></div>
        </div>
      </section>

      <section className="fun-banner">
        <div className="fun-image"><Img src={settings.interactiveImage} fallback={defaultImages.interactiveImage} alt="Guests playing lawn games at a Mingle event" sizes="(max-width: 860px) 100vw, 65vw" /></div>
        <div className="fun-copy">
          <p className="section-label">Fun &amp; Games</p>
          <h2><Accent text={settings.homeFunTitle} /></h2>
          <p>{settings.homeFunText}</p>
          <div className="actions"><Link className="btn-pink" href="/fun-and-games">Explore Fun &amp; Games →</Link></div>
          <Heart className="fun-heart" aria-hidden="true" />
        </div>
      </section>

      {gallery.length > 0 && (
        <section>
          <div className="section-head"><div><h2>{settings.galleryTitle}</h2><p className="section-label">Real events. Beautiful details.</p></div><Link className="text-link" href="/gallery">View the gallery →</Link></div>
          <div className="gallery-preview">
            {gallery.slice(0, 8).map((g, i) => <Link key={g.url} href="/gallery" className="gallery-tile"><Image src={g.url} alt={`The Mingle event photo ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 270px" /></Link>)}
          </div>
        </section>
      )}

      <BookCta />
    </>
  )
}
