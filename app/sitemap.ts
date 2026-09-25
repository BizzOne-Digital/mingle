import type { MetadataRoute } from 'next'
import { listPublic } from '@/lib/data'
import { site } from '@/lib/site'

const pages = ['', '/about', '/services', '/pricing', '/gallery', '/booking', '/contact', '/testimonials', '/faq', '/team', '/blogs']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([listPublic('blogs', { published: true }, 1000), listPublic('services')])
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${site.url}/blogs/${p.slug}`, lastModified: p.updatedAt, priority: 0.5 })),
  ]
}
