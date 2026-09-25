import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AudienceBand, Img } from '@/components/site'
import { getBlog } from '@/lib/data'
import { defaultImages, fmtDate } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlog((await params).slug)
  if (!post) return { title: 'Not found' }
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, alternates: { canonical: `/blogs/${post.slug}` }, openGraph: { type: 'article', title: post.seoTitle || post.title, images: post.image ? [post.image] : undefined } }
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlog((await params).slug)
  if (!post) notFound()
  const jsonLd = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, datePublished: post.publishedAt, author: post.author ? { '@type': 'Person', name: post.author } : undefined, image: post.image || undefined }
  return (
    <>
      <Link className="concept-back" href="/blogs">← All posts</Link>
      <article className="article">
        <p className="section-label">{post.publishedAt ? <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time> : 'Blog'}{post.author && ` · ${post.author}`}</p>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="concept-tagline">{post.excerpt}</p>}
        {post.image && <div className="article-image"><Img natural src={post.image} fallback={defaultImages.introImage} alt="" sizes="(max-width: 760px) 100vw, 720px" priority /></div>}
        <div className="about-body">{String(post.content || '').split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}</div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <AudienceBand />
    </>
  )
}
