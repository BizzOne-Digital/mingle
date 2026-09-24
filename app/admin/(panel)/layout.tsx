import { redirect } from 'next/navigation'
import { AdminNav, Toaster } from '@/components/admin'
import { isAdmin } from '@/lib/auth'

// Auth is per request: never prerender admin pages.
export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin', robots: { index: false, follow: false } }

// Every admin page is gated server-side here; every admin API checks isAdmin() independently.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/admin/login')
  return <div className="admin"><AdminNav /><main className="admin-main">{children}</main><Toaster /></div>
}
