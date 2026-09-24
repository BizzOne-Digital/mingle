import { site } from '@/lib/site'

export const dynamic = 'force-dynamic'

// Shows only whether each integration is configured — never the values.
export default function SettingsAdmin() {
  const env = process.env
  const rows: [string, boolean, string][] = [
    ['Database (MONGODB_URI)', !!env.MONGODB_URI, 'Required for inquiries, content and images.'],
    ['Admin login', !!(env.ADMIN_EMAIL && env.ADMIN_PASSWORD && (env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32), 'ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET'],
    ['Inquiry emails (SMTP)', !!(env.SMTP_HOST && env.SMTP_FROM && env.INQUIRY_NOTIFICATION_EMAIL), `Notifications go to ${env.INQUIRY_NOTIFICATION_EMAIL || 'INQUIRY_NOTIFICATION_EMAIL'}`],
    ['Stripe payments', !!env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY — needed to create deposit links.'],
    ['Stripe webhook', !!env.STRIPE_WEBHOOK_SECRET, `STRIPE_WEBHOOK_SECRET — endpoint ${site.url}/api/stripe/webhook`],
  ]
  return (
    <>
      <h1>Settings</h1>
      <p className="sub">Integrations are configured with environment variables in your hosting dashboard.</p>
      <div className="panel status-list">
        {rows.map(([label, okay, help]) => <div key={label}><span><strong>{label}</strong><br /><small>{help}</small></span><span className={`pill ${okay ? 'pill-booked' : 'pill-cancelled'}`}>{okay ? 'Connected' : 'Not set'}</span></div>)}
        <div><span><strong>Site URL</strong></span><span>{site.url}</span></div>
      </div>
    </>
  )
}
