import Link from 'next/link'
import { PagesEditor } from '@/components/admin'

export default function PricingAdmin() {
  return (
    <>
      <h1>Pricing</h1>
      <p className="sub">The price list on the Pricing page. Each offering's own price is set under Offerings. If you change them, also update the pricing answer under <Link href="/admin/faqs">FAQ</Link>.</p>
      <PagesEditor groups={['Pricing']} />
    </>
  )
}
