'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { INQUIRY_STATUSES, resources, UPLOAD_FOLDERS, type Field } from '@/lib/content'

/* ---------- shared ---------- */

type Json = Record<string, any>

async function api(url: string, init?: RequestInit): Promise<Json> {
  const res = await fetch(url, { ...init, headers: init?.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' } })
  const json = await res.json().catch(() => ({}))
  if (res.status === 401) window.location.href = '/admin/login'
  if (!res.ok || !json.success) throw new Error(json.error || `Request failed (${res.status})`)
  return json
}

export function toast(message: string, type: 'ok' | 'error' = 'ok') {
  window.dispatchEvent(new CustomEvent('admin-toast', { detail: { message, type } }))
}

export function Toaster() {
  const [t, setT] = useState<{ message: string; type: string } | null>(null)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const on = (e: Event) => { setT((e as CustomEvent).detail); clearTimeout(timer); timer = setTimeout(() => setT(null), 4000) }
    window.addEventListener('admin-toast', on)
    return () => window.removeEventListener('admin-toast', on)
  }, [])
  return <div aria-live="polite" role="status">{t && <div className={`toast ${t.type === 'error' ? 'error' : ''}`}>{t.message}</div>}</div>
}

const fail = (e: unknown) => toast((e as Error).message, 'error')
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '—')
const fmtSize = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`)
const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

function Dialog({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (open) ref.current?.showModal(); else ref.current?.close() }, [open])
  return (
    <dialog ref={ref} className="dialog" onClose={onClose} aria-labelledby="dialog-title">
      <div className="dialog-head"><h2 id="dialog-title">{title}</h2><button className="btn" onClick={onClose} aria-label="Close">Close</button></div>
      <div className="dialog-body">{open && children}</div>
    </dialog>
  )
}

/* ---------- navigation / auth ---------- */

const adminNav: [string, string][] = [
  ['/admin', 'Dashboard'], ['/admin/inquiries', 'Inquiries'], ['/admin/services', 'Services'], ['/admin/pricing', 'Pricing'], ['/admin/gallery', 'Gallery'],
  ['/admin/pages', 'Pages'], ['/admin/testimonials', 'Testimonials'], ['/admin/faqs', 'FAQ'], ['/admin/team', 'Team'], ['/admin/blogs', 'Blogs'],
  ['/admin/media', 'Media / Uploads'], ['/admin/settings', 'Settings'],
]

export function AdminNav() {
  const path = usePathname()
  const router = useRouter()
  return (
    <aside className="admin-side">
      <Link className="brand-mini" href="/admin">The <span>Mingle</span> admin</Link>
      <nav aria-label="Admin">{adminNav.map(([href, label]) => <Link key={href} href={href} aria-current={(href === '/admin' ? path === href : path.startsWith(href)) ? 'page' : undefined}>{label}</Link>)}</nav>
      <button onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.replace('/admin/login') }}>Sign out</button>
      <Link href="/" style={{ display: 'block', margin: '14px 10px 0', color: '#aaa' }}>View website →</Link>
    </aside>
  )
}

export function LoginForm() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) })
      window.location.href = '/admin'
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <label>Email<input name="email" type="email" required autoComplete="username" /></label>
      <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  )
}

/* ---------- image upload ---------- */

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX = 8 * 1024 * 1024
// Vercel caps function request bodies at ~4.5MB, so larger photos are downscaled in the browser first.
const DIRECT_LIMIT = 4 * 1024 * 1024

async function shrink(file: File): Promise<File> {
  if (file.size <= DIRECT_LIMIT || file.type === 'image/gif') return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.86))
  if (!blob) throw new Error('Could not process this image.')
  return new File([blob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' })
}

export function uploadImage(file: File, folder: string, onProgress: (pct: number) => void, replace?: string): Promise<Json> {
  return new Promise(async (resolve, reject) => {
    if (!TYPES.includes(file.type)) return reject(new Error('Only JPG, PNG, WebP and GIF images are allowed.'))
    if (file.size > MAX) return reject(new Error('Images must be 8MB or smaller.'))
    let body: File
    try { body = await shrink(file) } catch (e) { return reject(e) }
    const form = new FormData()
    form.append('file', body)
    form.append('folder', folder)
    if (replace) form.append('replace', replace)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload')
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => {
      let json: Json = {}
      try { json = JSON.parse(xhr.responseText) } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && json.success) resolve(json)
      else reject(new Error(json.error || (xhr.status === 413 ? 'This image is too large to upload.' : 'Upload failed.')))
    }
    xhr.onerror = () => reject(new Error('Network error during upload.'))
    xhr.send(form)
  })
}

/** Uploads to /api/upload (stored in MongoDB) and returns the saved URL through onChange. */
export function LocalImageField({ value, onChange, folder, label }: { value: string; onChange: (url: string) => void; folder: string; label: string }) {
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  async function pick(file?: File) {
    if (!file) return
    setProgress(0)
    try {
      const res = await uploadImage(file, folder, setProgress)
      onChange(res.url)
      toast('Image uploaded. Save to apply it.')
    } catch (e) {
      fail(e)
    } finally {
      setProgress(null)
      if (input.current) input.current.value = ''
    }
  }
  return (
    <div className="image-field">
      <div className="thumb">{value ? <img src={value} alt={`${label} preview`} style={{ width: '100%', height: '100%' }} /> : 'No image'}</div>
      <input ref={input} type="file" accept={TYPES.join(',')} hidden onChange={(e) => pick(e.target.files?.[0])} aria-label={`Upload ${label}`} />
      <button type="button" className="btn" disabled={progress !== null} onClick={() => input.current?.click()}>{progress !== null ? `Uploading ${progress}%` : value ? 'Replace' : 'Upload'}</button>
      {value && <button type="button" className="btn btn-danger" disabled={progress !== null} onClick={() => onChange('')}>Remove</button>}
    </div>
  )
}

/* ---------- generic content CRUD (services, testimonials, faqs, team, blogs) ---------- */

function FieldInput({ f, value, set, folder }: { f: Field; value: any; set: (v: any) => void; folder: string }) {
  const hint = f.help && <small>{f.help}</small>
  if (f.type === 'bool') return <label className="check"><input type="checkbox" checked={Boolean(value)} onChange={(e) => set(e.target.checked)} />{f.label}</label>
  if (f.type === 'image') return <div role="group" aria-label={f.label} style={{ display: 'grid', gap: 6 }}><strong style={{ fontSize: 13 }}>{f.label}</strong>{hint}<LocalImageField value={value || ''} onChange={set} folder={folder} label={f.label} /></div>
  if (f.type === 'textarea') return <label>{f.label}{hint}<textarea value={value ?? ''} maxLength={f.max} required={f.required} rows={f.max && f.max > 3000 ? 14 : 4} onChange={(e) => set(e.target.value)} /></label>
  const type = f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'email' ? 'email' : 'text'
  const v = f.type === 'date' ? String(value ?? '').slice(0, 10) : value ?? ''
  return <label>{f.label}{hint}<input type={type} value={v} maxLength={f.max} required={f.required} min={f.type === 'number' ? 0 : undefined} onChange={(e) => set(e.target.value)} /></label>
}

export function CrudManager({ resource }: { resource: string }) {
  const spec = resources[resource]
  const [items, setItems] = useState<Json[] | null>(null)
  const [editing, setEditing] = useState<Json | null>(null)
  const [busy, setBusy] = useState(false)
  const load = useCallback(() => api(`/api/${resource}`).then((r) => setItems(r.items)).catch((e) => { fail(e); setItems([]) }), [resource])
  useEffect(() => { load() }, [load])

  const blank = () => Object.fromEntries(spec.fields.map((f) => [f.name, f.default ?? (f.type === 'bool' ? false : '')]))
  const titleField = spec.fields[0].name

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setBusy(true)
    const { _id, createdAt, updatedAt, __v, ...body } = editing
    try {
      await api(_id ? `/api/${resource}/${_id}` : `/api/${resource}`, { method: _id ? 'PATCH' : 'POST', body: JSON.stringify(body) })
      toast('Saved.')
      setEditing(null)
      load()
    } catch (err) { fail(err) } finally { setBusy(false) }
  }

  async function remove(item: Json) {
    if (!confirm(`Delete "${item[titleField]}"? This cannot be undone.`)) return
    try { await api(`/api/${resource}/${item._id}`, { method: 'DELETE' }); toast('Deleted.'); load() } catch (e) { fail(e) }
  }

  const set = (name: string, v: any) => setEditing((cur) => {
    const next = { ...cur, [name]: v }
    // Suggest a slug from the name/title while creating.
    if (!cur?._id && name === titleField && spec.fields.some((f) => f.name === 'slug') && (!cur?.slug || cur.slug === slugify(cur[titleField] || ''))) next.slug = slugify(v)
    return next
  })

  const cell = (item: Json, col: string) => {
    const f = spec.fields.find((x) => x.name === col)
    if (f?.type === 'bool') return item[col] ? 'Yes' : 'No'
    if (f?.type === 'date') return fmtDate(item[col])
    return item[col] || '—'
  }

  return (
    <>
      <div className="admin-bar"><button className="btn btn-primary" onClick={() => setEditing(blank())}>Add {spec.label.toLowerCase().replace(/s$/, '')}</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr>{spec.columns.map((c) => <th key={c}>{spec.fields.find((f) => f.name === c)?.label}</th>)}<th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {items === null ? <tr><td colSpan={9}>Loading…</td></tr> : items.length === 0 ? <tr><td colSpan={9}>Nothing here yet.</td></tr> : items.map((item) => (
              <tr key={item._id}>
                {spec.columns.map((c) => <td key={c}>{cell(item, c)}</td>)}
                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}><button className="btn" onClick={() => setEditing(item)}>Edit</button> <button className="btn btn-danger" onClick={() => remove(item)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!editing} title={editing?._id ? `Edit ${spec.label.toLowerCase()}` : `New ${spec.label.toLowerCase()}`} onClose={() => setEditing(null)}>
        <form className="admin-form" onSubmit={save}>
          {spec.fields.map((f) => <FieldInput key={f.name} f={f} value={editing?.[f.name]} set={(v) => set(f.name, v)} folder={spec.folder} />)}
          <div className="row-actions"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button></div>
        </form>
      </Dialog>
    </>
  )
}

/* ---------- inquiries ---------- */

export function InquiriesManager() {
  const [items, setItems] = useState<Json[] | null>(null)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [open, setOpen] = useState<Json | null>(null)
  const [amount, setAmount] = useState('')
  const [busy, setBusy] = useState(false)
  const load = useCallback(() => {
    const params = new URLSearchParams({ ...(q && { q }), ...(status && { status }) })
    return api(`/api/inquiries?${params}`).then((r) => setItems(r.items)).catch((e) => { fail(e); setItems([]) })
  }, [q, status])
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])

  const replace = (item: Json) => { setOpen(item); setItems((cur) => cur?.map((i) => (i._id === item._id ? item : i)) ?? null) }

  async function changeStatus(value: string) {
    try { const r = await api(`/api/inquiries/${open!._id}`, { method: 'PATCH', body: JSON.stringify({ status: value }) }); replace(r.item); toast('Status updated.') } catch (e) { fail(e) }
  }
  async function requestDeposit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try { const r = await api('/api/deposits', { method: 'POST', body: JSON.stringify({ inquiryId: open!._id, amount: Number(amount) }) }); replace(r.item); toast('Deposit link created.') } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function remove() {
    if (!confirm(`Delete the inquiry from ${open!.name}? This cannot be undone.`)) return
    try { await api(`/api/inquiries/${open!._id}`, { method: 'DELETE' }); setOpen(null); toast('Inquiry deleted.'); load() } catch (e) { fail(e) }
  }

  return (
    <>
      <div className="admin-bar">
        <input type="search" placeholder="Search name, email, phone, event…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search inquiries" style={{ flex: '1 1 260px' }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}</select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Received</th><th>Name</th><th>Event</th><th>Date</th><th>Guests</th><th>Experience</th><th>Status</th><th>Deposit</th></tr></thead>
          <tbody>
            {items === null ? <tr><td colSpan={8}>Loading…</td></tr> : items.length === 0 ? <tr><td colSpan={8}>No inquiries found.</td></tr> : items.map((i) => (
              <tr key={i._id} className="clickable" tabIndex={0} onClick={() => { setOpen(i); setAmount('') }} onKeyDown={(e) => e.key === 'Enter' && setOpen(i)}>
                <td>{fmtDate(i.createdAt)}</td><td><strong>{i.name}</strong><br /><small>{i.email}</small></td><td>{i.eventType}</td><td>{fmtDate(i.eventDate)}</td><td>{i.guestCount ?? '—'}</td><td>{i.service || '—'}</td>
                <td><span className={`pill pill-${i.status}`}>{i.status}</span></td><td><span className={`pill pill-${i.depositStatus}`}>{i.depositStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!open} title={open ? `Inquiry — ${open.name}` : ''} onClose={() => setOpen(null)}>
        {open && <>
          <dl className="detail-list">
            <dt>Name</dt><dd>{open.name}</dd>
            <dt>Email</dt><dd><a href={`mailto:${open.email}`}>{open.email}</a></dd>
            <dt>Phone</dt><dd><a href={`tel:${String(open.phone).replace(/[^\d+]/g, '')}`}>{open.phone}</a></dd>
            <dt>Event type</dt><dd>{open.eventType}</dd>
            <dt>Event date</dt><dd>{fmtDate(open.eventDate)}</dd>
            <dt>Guest count</dt><dd>{open.guestCount ?? '—'}</dd>
            <dt>Experience</dt><dd>{open.service || '—'}</dd>
            <dt>Budget</dt><dd>{open.budget || '—'}</dd>
            <dt>Message</dt><dd>{open.message || '—'}</dd>
            <dt>Received</dt><dd>{new Date(open.createdAt).toLocaleString('en-US')}</dd>
          </dl>
          <div className="admin-form">
            <label>Status<select value={open.status} onChange={(e) => changeStatus(e.target.value)}>{INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}</select></label>
          </div>
          <div className="panel" style={{ margin: '20px 0' }}>
            <h3 style={{ fontSize: 18 }}>Deposit — <span className={`pill pill-${open.depositStatus}`}>{open.depositStatus}</span></h3>
            {open.depositAmount ? <p>Amount: ${(open.depositAmount / 100).toFixed(2)}{open.paidAt && ` · paid ${new Date(open.paidAt).toLocaleString('en-US')}`}</p> : null}
            {open.depositUrl && open.depositStatus !== 'paid' && <p style={{ overflowWrap: 'anywhere' }}>Payment link: <a href={open.depositUrl} target="_blank" rel="noreferrer">{open.depositUrl}</a> <button type="button" className="btn" onClick={() => navigator.clipboard.writeText(open.depositUrl).then(() => toast('Link copied.'))}>Copy link</button></p>}
            {open.depositStatus !== 'paid' && (
              <form className="admin-form" onSubmit={requestDeposit}>
                <label>Deposit amount (USD)<small>Approving creates a secure Stripe payment link and marks the inquiry as booked. Send the link to the client.</small>
                  <input type="number" min={1} max={100000} step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
                <div className="row-actions"><button className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : open.depositUrl ? 'Create a new deposit link' : 'Approve & create deposit link'}</button></div>
              </form>
            )}
          </div>
          <button className="btn btn-danger" onClick={remove}>Delete inquiry</button>
        </>}
      </Dialog>
    </>
  )
}

/* ---------- media library ---------- */

export function MediaLibrary({ folder }: { folder?: string }) {
  const [items, setItems] = useState<Json[] | null>(null)
  const [target, setTarget] = useState(folder || 'gallery')
  const [progress, setProgress] = useState<number | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const replacing = useRef<string | undefined>(undefined)
  const load = useCallback(() => api(`/api/upload${folder ? `?folder=${folder}` : ''}`).then((r) => setItems(r.items)).catch((e) => { fail(e); setItems([]) }), [folder])
  useEffect(() => { load() }, [load])

  async function pick(file?: File) {
    if (!file) return
    setProgress(0)
    try {
      const replace = replacing.current
      await uploadImage(file, replace ? replace.split('/')[3] : target, setProgress, replace)
      toast(replace ? 'Image replaced everywhere it was used.' : 'Image uploaded.')
      load()
    } catch (e) { fail(e) } finally {
      setProgress(null)
      replacing.current = undefined
      if (input.current) input.current.value = ''
    }
  }
  async function remove(url: string) {
    if (!confirm('Delete this image? Any content still using it will show a placeholder image.')) return
    try { await api(`/api/upload?url=${encodeURIComponent(url)}`, { method: 'DELETE' }); toast('Image deleted.'); load() } catch (e) { fail(e) }
  }

  return (
    <>
      <div className="admin-bar">
        {!folder && <select value={target} onChange={(e) => setTarget(e.target.value)} aria-label="Upload folder">{UPLOAD_FOLDERS.map((f) => <option key={f}>{f}</option>)}</select>}
        <input ref={input} type="file" accept={TYPES.join(',')} hidden onChange={(e) => pick(e.target.files?.[0])} aria-label="Choose image" />
        <button className="btn btn-primary" disabled={progress !== null} onClick={() => { replacing.current = undefined; input.current?.click() }}>{progress !== null ? `Uploading ${progress}%` : 'Upload image'}</button>
        <small>JPG, PNG, WebP or GIF · up to 8MB · stored in the database, safe across redeploys</small>
      </div>
      {items === null ? <p>Loading…</p> : items.length === 0 ? <div className="panel">No images yet.</div> : (
        <div className="media-grid">
          {items.map((m) => (
            <figure key={m._id}>
              <div className="thumb"><img src={m.url} alt={m.filename} loading="lazy" style={{ width: '100%', height: '100%' }} /></div>
              <figcaption>
                <span>{m.folder} · {fmtSize(m.size)} · {fmtDate(m.createdAt)}</span>
                <div>
                  <button className="btn" onClick={() => navigator.clipboard.writeText(m.url).then(() => toast('URL copied.'))}>Copy URL</button>
                  <button className="btn" disabled={progress !== null} onClick={() => { replacing.current = m.url; input.current?.click() }}>Replace</button>
                  <button className="btn btn-danger" onClick={() => remove(m.url)}>Delete</button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  )
}

/* ---------- page images + pricing copy ---------- */

export function SettingsForm({ fields }: { fields: Field[] }) {
  const [values, setValues] = useState<Json | null>(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => { api('/api/settings').then((r) => setValues(r.settings)).catch((e) => { fail(e); setValues({}) }) }, [])
  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    const body = Object.fromEntries(fields.map((f) => [f.name, values?.[f.name] ?? '']))
    try { const r = await api('/api/settings', { method: 'PATCH', body: JSON.stringify(body) }); setValues(r.settings); toast('Saved.') } catch (err) { fail(err) } finally { setBusy(false) }
  }
  if (!values) return <p>Loading…</p>
  return (
    <form className="admin-form panel" onSubmit={save}>
      {fields.map((f) => <FieldInput key={f.name} f={f} value={values[f.name]} set={(v) => setValues({ ...values, [f.name]: v })} folder="pages" />)}
      <p><small>Leave an image empty to use the current temporary image.</small></p>
      <div className="row-actions"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></div>
    </form>
  )
}

