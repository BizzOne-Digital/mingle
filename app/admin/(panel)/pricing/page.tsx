import Link from 'next/link'
import { PagesEditor } from '@/components/admin'

export default function PricingAdmin() {
  return (
    <>
      <h1>Pricing</h1>
      <p className="sub">The only two prices shown on the website (Pricing page and the Curated Carts offering). If you change them, also update the pricing answer under <Link href="/admin/faqs">FAQ</Link>.</p>
      <PagesEditor groups={['Pricing']} />
    </>
  )
}
