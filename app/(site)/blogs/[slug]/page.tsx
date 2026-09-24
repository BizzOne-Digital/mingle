import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand, Img } from '@/components/site'
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
      <article className="section-pad article">
        <p className="eyebrow"><Link href="/blogs">Blogs</Link>{post.publishedAt && <> · <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time></>}</p>
        <h1>{post.title}</h1>
        {post.author && <p className="lead">By {post.author}</p>}
        {post.image && <div className="image-frame"><Img src={post.image} fallback={defaultImages.introImage} alt="" sizes="(max-width: 800px) 100vw, 760px" priority /></div>}
        <div className="prose">{String(post.content || '').split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}</div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <CtaBand />
    </>
  )
}
