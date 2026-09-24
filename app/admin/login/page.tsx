import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin'
import { isAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin sign in', robots: { index: false, follow: false } }

export default async function Login() {
  if (await isAdmin()) redirect('/admin')
  const configured = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32)
  return (
    <main className="login">
      <div className="panel">
        <h1>The Mingle admin</h1>
        {!configured && <p className="form-error" role="alert">Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ characters).</p>}
        <LoginForm />
      </div>
    </main>
  )
}
