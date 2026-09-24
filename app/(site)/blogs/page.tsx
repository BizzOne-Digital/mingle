import Link from 'next/link'
import { CtaBand, EmptyState, Img, PageHero } from '@/components/site'
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
      <PageHero eyebrow="Blogs" title={<>Ideas for your <em>next gathering.</em></>} intro="Inspiration, ideas and behind-the-scenes stories from The Mingle." />
      <section className="section-pad" style={{ paddingTop: 0 }}>
        {posts.length === 0 ? <EmptyState title="Our first stories are coming" text="We are putting together ideas and inspiration for your next event. Follow along on Instagram in the meantime." /> : (
          <div className="blog-grid">
            {posts.map((p) => (
              <article className="blog-card reveal" key={p._id}>
                <Link href={`/blogs/${p.slug}`}>
                  <div className="image-frame"><Img src={p.image} fallback={defaultImages.introImage} alt="" sizes="(max-width: 600px) 100vw, 33vw" /></div>
                  {p.publishedAt && <time dateTime={p.publishedAt}>{fmtDate(p.publishedAt)}</time>}
                  <h2>{p.title}</h2>
                </Link>
                {p.excerpt && <p>{p.excerpt}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  )
}
