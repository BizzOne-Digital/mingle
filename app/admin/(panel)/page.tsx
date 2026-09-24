import Link from 'next/link'
import { StoredUpload, db, models } from '@/lib/db'

export const dynamic = 'force-dynamic'

const fmt = (d: Date) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default async function Dashboard() {
  let counts: Record<string, number> | null = null
  let recent: any[] = []
  try {
    await db()
    const keys = ['services', 'testimonials', 'faqs', 'team', 'blogs']
    const [newCount, total, media, ...rest] = await Promise.all([
      models.inquiries.countDocuments({ status: 'new' }), models.inquiries.countDocuments(), StoredUpload.estimatedDocumentCount(),
      ...keys.map((k) => models[k].countDocuments()),
    ])
    counts = { newCount, total, media, ...Object.fromEntries(keys.map((k, i) => [k, rest[i]])) }
    recent = await models.inquiries.find().sort({ createdAt: -1 }).limit(5).select('name eventType status createdAt').lean()
  } catch {}

  if (!counts) return <><h1>Dashboard</h1><p className="form-error">Database not connected. Set MONGODB_URI and reload.</p></>

  const tiles: [string, string, number][] = [
    ['/admin/inquiries', 'New inquiries', counts.newCount], ['/admin/inquiries', 'All inquiries', counts.total], ['/admin/services', 'Services', counts.services],
    ['/admin/faqs', 'FAQs', counts.faqs], ['/admin/testimonials', 'Testimonials', counts.testimonials], ['/admin/team', 'Team members', counts.team],
    ['/admin/blogs', 'Blog posts', counts.blogs], ['/admin/media', 'Images', counts.media],
  ]
  return (
    <>
      <h1>Dashboard</h1>
      <p className="sub">Inquiries, content and images for the-mingle.com.</p>
      <div className="stats">{tiles.map(([href, label, n]) => <Link key={label} href={href}><strong>{n}</strong>{label}</Link>)}</div>
      <h2 style={{ fontSize: 22 }}>Latest inquiries</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Received</th><th>Name</th><th>Event</th><th>Status</th></tr></thead>
          <tbody>{recent.length === 0 ? <tr><td colSpan={4}>No inquiries yet.</td></tr> : recent.map((i) => <tr key={String(i._id)}><td>{fmt(i.createdAt)}</td><td><Link href="/admin/inquiries">{i.name}</Link></td><td>{i.eventType}</td><td><span className={`pill pill-${i.status}`}>{i.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </>
  )
}
