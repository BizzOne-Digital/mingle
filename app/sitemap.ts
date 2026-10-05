import type { MetadataRoute } from 'next'
import { listPublic } from '@/lib/data'
import { site } from '@/lib/site'

const pages = ['', '/about', '/offerings', '/fun-and-games', '/pricing', '/gallery', '/booking', '/contact', '/testimonials', '/faq', '/privacy', '/terms']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await listPublic('services')
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${site.url}/offerings/${s.slug}`, priority: 0.6 })),
  ]
}
