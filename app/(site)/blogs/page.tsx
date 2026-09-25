import Link from 'next/link'
import { AudienceBand, EmptyState, Img, PageHead } from '@/components/site'
import { listPublic } from '@/lib/data'
import { defaultImages, fmtDate } from '@/lib/site'

export const metadata = {
  title: 'Blogs',
  description: 'Ideas, inspiration and behind-the-scenes stories from The Mingle.',
  alternates: { canonical: '/blogs' },
}

export default async function Blogs() {
  const posts = await listPublic('blogs', { published: true })
  return (
    <>
      <PageHead label="Blogs" title="Ideas for your next gathering" intro="Inspiration, ideas and behind-the-scenes stories from The Mingle." />
      {posts.length === 0 ? <EmptyState title="Our first stories are coming" text="We are putting together ideas and inspiration for your next event. Follow along on Instagram in the meantime." /> : (
        <div className="concepts-grid">
          {posts.map((p) => (
            <Link className="concept-card" key={p._id} href={`/blogs/${p.slug}`}>
              <div className="card-img" style={{ height: 260 }}><Img src={p.image} fallback={defaultImages.introImage} alt="" sizes="(max-width: 640px) 100vw, 360px" /></div>
              <div className="card-body">
                {p.publishedAt && <p className="card-num"><time dateTime={p.publishedAt}>{fmtDate(p.publishedAt).toUpperCase()}</time></p>}
                <h2 className="card-name">{p.title}</h2>
                {p.excerpt && <p className="card-desc">{p.excerpt}</p>}
                <p className="card-more">Read more</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <AudienceBand />
    </>
  )
}
