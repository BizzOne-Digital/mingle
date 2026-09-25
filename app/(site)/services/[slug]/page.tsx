import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AudienceBand, Img } from '@/components/site'
import { getOne } from '@/lib/data'
import { audiences, defaultImages } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }
const find = async (params: Props['params']) => getOne('services', { slug: (await params).slug, active: true })

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await find(params)
  if (!s) return { title: 'Not found' }
  return { title: s.name, description: s.description, alternates: { canonical: `/services/${s.slug}` } }
}

// Layout of the live site's concept detail page: back link, wide image, title, details + price sidebar.
export default async function Service({ params }: Props) {
  const s = await find(params)
  if (!s) notFound()
  const book = `/booking?service=${encodeURIComponent(s.name)}`
  return (
    <>
      <Link className="concept-back" href="/services">← All services</Link>
      <div className="concept-hero"><Img src={s.image} fallback={defaultImages.introImage} alt={s.name} sizes="(max-width: 1120px) 100vw, 1072px" priority /></div>
      <div className="concept-intro">
        <h1 className="concept-title">{s.name}</h1>
        <p className="concept-tagline">{s.description}</p>
      </div>
      <div className="concept-body">
        <div>
          <p className="detail-label">The experience</p>
          <p className="detail-value">Every Mingle experience is curated around your event, your guests and your vision — fun, creative, interactive and beautifully styled.</p>
          <p className="detail-label">Perfect for</p>
          <ul className="includes-list single">{audiences.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
        <aside className="concept-aside">
          {s.startingPrice ? <p className="price-display small">{s.startingPrice}</p> : <p className="price-display small">Custom quote</p>}
          <p className="price-note">We will customize a price plan for your budget. Your final quote is confirmed in a custom proposal.</p>
          <Link className="btn-pink" href={book}>Book this experience</Link>
          <Link className="btn-outline" href="/contact">Ask a question</Link>
        </aside>
      </div>
      <AudienceBand />
    </>
  )
}
