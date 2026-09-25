import { AudienceBand, EmptyState, PageHead } from '@/components/site'
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
      <PageHead label="Testimonials" title="Kind words" intro="What our clients say about celebrating with The Mingle." />
      {items.length === 0 ? <EmptyState title="Client stories are on the way" text="We are gathering words from our recent celebrations. In the meantime, see our latest work on Instagram." /> : (
        <div className="quotes">{items.map((t) => <figure key={t._id}><blockquote className="about-quote">“{t.text}”</blockquote><figcaption>{t.name}{t.eventType && <span> · {t.eventType}</span>}</figcaption></figure>)}</div>
      )}
      <AudienceBand />
    </>
  )
}
