import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { site } from '@/lib/site'
import './globals.css'

// The site logo, trimmed and padded to a square by Cloudinary (the source is a wide 683×315 image).
const favicon = (size: number) => site.logo.replace('/upload/', `/upload/e_trim/c_pad,w_${size},h_${size},b_white,f_png/`).replace(/\.jpg$/, '.png')

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'The Mingle | Unique, Curated Event Experiences in Kansas City', template: '%s | The Mingle' },
  description: 'The Mingle creates unique, curated event experiences — curated carts, the Bliss Bar, Petal Passion flower bar and interactive vignettes for weddings, corporate events and celebrations in Kansas City.',
  openGraph: { type: 'website', siteName: 'The Mingle', title: 'The Mingle | Unique, curated experiences for your event', description: 'Curated carts, the Bliss Bar, Petal Passion and interactive event vignettes in Kansas City.' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: [{ url: favicon(64), type: 'image/png', sizes: '64x64' }], apple: [{ url: favicon(180), sizes: '180x180' }] },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#ffffff', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
