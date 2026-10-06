import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin'
import { isAdmin } from '@/lib/auth'
import { site } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin sign in', robots: { index: false, follow: false } }

export default async function Login() {
  if (await isAdmin()) redirect('/admin')
  const configured = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32)
  return (
    <main className="login">
      <div className="panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={site.logo} alt="The Mingle" style={{ width: 180, height: 'auto', margin: '0 auto 18px', display: 'block' }} />
        <h1 style={{ textAlign: 'center' }}>Admin sign in</h1>
        {!configured && <p className="form-error" role="alert">Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ characters).</p>}
        <LoginForm />
      </div>
    </main>
  )
}
