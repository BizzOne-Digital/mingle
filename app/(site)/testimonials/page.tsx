import { CtaBand, EmptyState, PageHero } from '@/components/site'
import { listPublic } from '@/lib/data'

export const metadata = {
  title: 'Testimonials',
  description: 'Kind words from clients who have celebrated with The Mingle.',
  alternates: { canonical: '/testimonials' },
}

export default async function Testimonials() {
  const items = await listPublic('testimonials')
  return (
    <>
      <PageHero eyebrow="Testimonials" title={<>Kind <em>words.</em></>} intro="What our clients say about celebrating with The Mingle." />
      <section className="section-pad" style={{ paddingTop: 0 }}>
        {items.length === 0 ? <EmptyState title="Client stories are on the way" text="We are gathering words from our recent celebrations. In the meantime, see our latest work on Instagram." /> : (
          <div className="quote-grid">{items.map((t) => <figure className="quote reveal" key={t._id}><blockquote>“{t.text}”</blockquote><figcaption>{t.name}{t.eventType && <span> · {t.eventType}</span>}</figcaption></figure>)}</div>
        )}
      </section>
      <CtaBand />
    </>
  )
}
