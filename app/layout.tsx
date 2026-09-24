import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { site } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'The Mingle | Unique, Curated Event Experiences in Kansas City', template: '%s | The Mingle' },
  description: 'The Mingle creates unique, curated event experiences — curated carts, the Bliss Bar, Petal Passion flower bar and interactive vignettes for weddings, corporate events and celebrations in Kansas City.',
  openGraph: { type: 'website', siteName: 'The Mingle', title: 'The Mingle | Unique, curated experiences for your event', description: 'Curated carts, the Bliss Bar, Petal Passion and interactive event vignettes in Kansas City.' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#ffffff', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
