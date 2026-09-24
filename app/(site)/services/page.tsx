import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CtaBand, EmptyState, Img, PageHero } from '@/components/site'
import { listPublic } from '@/lib/data'
import { defaultImages } from '@/lib/site'

export const metadata = {
  title: 'Services',
  description: 'Curated carts, the Bliss Bar build-your-own takeaway, Petal Passion flower bar, interactive experiences and event vignettes by The Mingle in Kansas City.',
  alternates: { canonical: '/services' },
}

export default async function Services() {
  const services = await listPublic('services')
  return (
    <>
      <PageHero eyebrow="Our services" title={<>The experience <em>menu.</em></>} intro="Curated, interactive experiences designed around your event. Our menu continues to grow as new selections are added." />
      <section className="section-pad" style={{ paddingTop: 0 }}>
        {services.length === 0 ? <EmptyState title="Our menu is being refreshed" text="New experiences are on the way. Reach out and we will walk you through what is available for your date." /> : services.map((s, i) => (
          <article className="service-row reveal" key={s._id ?? s.slug} id={s.slug}>
            <div className="image-frame"><Img src={s.image} fallback={defaultImages.introImage} alt={s.name} sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div>
              <p className="index">{String(i + 1).padStart(2, '0')}</p>
              <h2>{s.name}</h2>
              <p className="lead">{s.description}</p>
              {s.startingPrice && <p className="price-note">{s.startingPrice}</p>}
              <Link className="text-link" href={`/booking?service=${encodeURIComponent(s.name)}`}>Inquire about {s.name} <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </article>
        ))}
      </section>
      <CtaBand />
    </>
  )
}
