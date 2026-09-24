import { SettingsForm } from '@/components/admin'
import { settingsFields } from '@/lib/content'

export default function PagesAdmin() {
  return (
    <>
      <h1>Pages</h1>
      <p className="sub">Replace the temporary page imagery with your own photography.</p>
      <SettingsForm fields={settingsFields.filter((f) => f.type === 'image')} />
    </>
  )
}
