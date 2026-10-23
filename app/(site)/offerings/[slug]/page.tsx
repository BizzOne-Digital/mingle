import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarHeart, Heart, MapPin, MessageCircle, Sparkles, Users } from 'lucide-react'
import { notFound } from 'next/navigation'
import { BookCta, ConceptGrid, Img, Lines, Paragraphs, serviceImage } from '@/components/site'
import { getOne, listPublic } from '@/lib/data'
import { audiences, site } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }
const find = async (params: Props['params']) => getOne('services', { slug: (await params).slug, active: true })

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await find(params)
  if (!s) return { title: 'Not found' }
  return { title: s.name, description: s.description, alternates: { canonical: `/offerings/${s.slug}` } }
}

// Flow: hero (name, first paragraph, main photo) → story + price card → photo mosaic → perfect for
// → more offerings → booking CTA. Everything comes from Admin → Offerings.
export default async function Offering({ params }: Props) {
  const [s, services] = await Promise.all([find(params), listPublic('services')])
  if (!s) notFound()
  const photos: string[] = [s.photo1, s.photo2, s.photo3, s.photo4].filter(Boolean)
  const [intro, ...story] = String(s.description).split(/\n\s*\n/)
  const others = services.filter((o) => o.slug !== s.slug).slice(0, 3)
  const book = `/booking?service=${encodeURIComponent(s.name)}`
  return (
    <>
      <section className="hero" aria-labelledby="offering-title">
        <div className="hero-copy">
          <Link className="section-label concept-back-link" href="/offerings">← All offerings</Link>
          <h1 id="offering-title">{s.name}</h1>
          <p className="lead lines"><Lines text={intro} /></p>
          <div className="actions"><Link className="btn-pink" href={book}>Book your date →</Link><Link className="btn-outline" href="/contact">Ask a question</Link></div>
          <ul className="about-chips">
            <li><MapPin size={16} aria-hidden="true" />Kansas City area</li>
            <li><Heart size={16} aria-hidden="true" />Fully styled</li>
            <li><Users size={16} aria-hidden="true" />Interactive</li>
          </ul>
        </div>
        <div className="hero-visual">
          <div className="hero-main"><Img src={s.image} fallback={serviceImage(s.slug)} alt={s.name} sizes="(max-width: 860px) 100vw, 50vw" priority /></div>
        </div>
      </section>

      <section className="offering-body">
        <div className="offering-story">
          <p className="rule-label rule-left">The experience</p>
          {story.length > 0
            ? <div className="about-body"><Paragraphs text={story.join('\n\n')} /></div>
            : <div className="about-body"><p>Every Mingle experience is curated around your event, your guests and your vision — fun, creative, interactive and beautifully styled.</p></div>}
        </div>
        <aside className="concept-aside">
          <p className="price-label">Pricing</p>
          {/* Each offering's price is set in Admin → Offerings; empty means it is quoted per event. */}
          <p className="price-display small">{s.price || 'Custom quote'}</p>
          <p className="price-note">Customized packages are welcome. Your final quote is confirmed in a custom proposal.</p>
          <Link className="btn-pink" href={book}><CalendarHeart size={16} aria-hidden="true" />Book this experience</Link>
          <a className="btn-outline btn-whatsapp" href={site.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" />WhatsApp us</a>
        </aside>
      </section>

      {photos.length > 0 && (
        <section aria-labelledby="photos-title">
          <div className="section-head"><p className="section-label" id="photos-title">See it in action</p><Link className="text-link" href="/gallery">View the gallery →</Link></div>
          <div className={`mosaic mosaic-${Math.min(photos.length + 1, 5)}`}>
            {[s.image || serviceImage(s.slug), ...photos].map((src, i) => <div key={src + i} className="mosaic-tile"><Img src={src} fallback={serviceImage(s.slug)} alt={`${s.name} photo ${i + 1}`} sizes={i ? '(max-width: 640px) 50vw, 270px' : '(max-width: 640px) 100vw, 420px'} /></div>)}
          </div>
        </section>
      )}

      <section aria-labelledby="perfect-title" className="perfect-for">
        <p className="rule-label" id="perfect-title">Perfect for</p>
        <ul className="pill-list">{audiences.map((a) => <li key={a}><Sparkles size={16} aria-hidden="true" />{a}</li>)}</ul>
      </section>

      {others.length > 0 && (
        <section>
          <div className="section-head center-head"><div><h2>More offerings</h2></div><Link className="text-link" href="/offerings">All offerings →</Link></div>
          <ConceptGrid services={others} short />
        </section>
      )}
      <BookCta />
    </>
  )
}
