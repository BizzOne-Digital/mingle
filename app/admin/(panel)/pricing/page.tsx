import Link from 'next/link'
import { SettingsForm } from '@/components/admin'
import { settingsFields } from '@/lib/content'

export default function PricingAdmin() {
  return (
    <>
      <h1>Pricing</h1>
      <p className="sub">The curated carts starting price appears on the Home, Pricing and FAQ pages. Per-experience starting prices are set on each <Link href="/admin/services">service</Link>.</p>
      <SettingsForm fields={settingsFields.filter((f) => f.name === 'pricingStartingPrice')} />
    </>
  )
}
