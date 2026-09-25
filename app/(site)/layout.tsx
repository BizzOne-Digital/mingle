import Header from '@/components/header'
import { Footer } from '@/components/site'
import { site } from '@/lib/site'

// Content is refreshed on every admin save (revalidatePath); hourly as a safety net.
export const revalidate = 3600

// No street address or hours are published: the client has not provided them.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: site.name,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: site.logo,
  description: site.headline,
  areaServed: { '@type': 'City', name: 'Kansas City' },
  sameAs: [site.instagramHref],
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="site">
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  )
}
