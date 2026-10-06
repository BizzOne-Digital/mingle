import Link from 'next/link'
import { StoredUpload, db, models } from '@/lib/db'

export const dynamic = 'force-dynamic'

const fmt = (d: Date) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const actions: [string, string, string][] = [
  ['/admin/pages', 'Edit page text & images', 'Headlines, paragraphs and photos for every page'],
  ['/admin/gallery', 'Manage the gallery', 'Add, delete or hide gallery photos'],
  ['/admin/services', 'Update offerings', 'Names, descriptions and photos'],
  ['/admin/pricing', 'Change prices', 'Curated carts and wedding proposals'],
]

export default async function Dashboard() {
  let counts: Record<string, number> | null = null
  let recent: any[] = []
  try {
    await db()
    const [newCount, total, services, faqs, testimonials, gallery, media] = await Promise.all([
      models.inquiries.countDocuments({ status: 'new' }), models.inquiries.countDocuments(), models.services.countDocuments({ active: true }),
      models.faqs.countDocuments({ active: true }), models.testimonials.countDocuments({ active: true }),
      StoredUpload.countDocuments({ folder: 'gallery' }), StoredUpload.estimatedDocumentCount(),
    ])
    counts = { newCount, total, services, faqs, testimonials, gallery, media }
    recent = await models.inquiries.find().sort({ createdAt: -1 }).limit(6).select('name eventType eventDate status createdAt').lean()
  } catch {}

  if (!counts) return <><h1>Dashboard</h1><p className="form-error">Database not connected. Set MONGODB_URI and reload.</p></>

  const tiles: [string, string, number, boolean?][] = [
    ['/admin/inquiries', 'New inquiries', counts.newCount, counts.newCount > 0], ['/admin/inquiries', 'All inquiries', counts.total],
    ['/admin/services', 'Live offerings', counts.services], ['/admin/gallery', 'Uploaded gallery photos', counts.gallery],
    ['/admin/testimonials', 'Testimonials', counts.testimonials], ['/admin/faqs', 'FAQs', counts.faqs],
  ]
  return (
    <>
      <h1>Welcome back</h1>
      <p className="sub">Manage inquiries and everything on the-mingle.com from here.</p>
      <div className="stats">{tiles.map(([href, label, n, hot]) => <Link key={label} href={href} className={hot ? 'hot' : undefined}><strong>{n}</strong>{label}</Link>)}</div>

      <div className="dash-grid">
        <section className="panel">
          <div className="admin-section-head"><h2>Latest inquiries</h2><Link className="btn" href="/admin/inquiries">View all</Link></div>
          <div className="table-wrap flat">
            <table>
              <thead><tr><th>Received</th><th>Name</th><th>Event</th><th>Status</th></tr></thead>
              <tbody>{recent.length === 0 ? <tr><td colSpan={4}>No inquiries yet.</td></tr> : recent.map((i) => <tr key={String(i._id)}><td>{fmt(i.createdAt)}</td><td><Link href="/admin/inquiries">{i.name}</Link></td><td>{i.eventType}</td><td><span className={`pill pill-${i.status}`}>{i.status}</span></td></tr>)}</tbody>
            </table>
          </div>
        </section>
        <section className="panel">
          <div className="admin-section-head"><h2>Quick actions</h2></div>
          <div className="quick-actions">{actions.map(([href, title, text]) => <Link key={href} href={href}><strong>{title}</strong><span>{text}</span></Link>)}</div>
        </section>
      </div>
    </>
  )
}
