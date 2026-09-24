'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { EVENT_TYPES } from '@/lib/content'

export default function BookingForm({ services, defaultService = '' }: { services: string[]; defaultService?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setState('sending')
    const body = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.success) throw new Error(json.error || 'Something went wrong. Please try again, or call us at 913-706-2347.')
      setState('sent')
    } catch (err) {
      setError((err as Error).message)
      setState('idle')
    }
  }

  if (state === 'sent') return (
    <div className="form-success" role="status">
      <div className="check" aria-hidden="true"><Check /></div>
      <h2>Thank you — your inquiry is <em>in.</em></h2>
      <p className="lead">We have received your event details and will be in touch shortly to talk through your vision and next steps.</p>
      <Link className="text-link" href="/services">Explore our experiences <ArrowRight size={16} aria-hidden="true" /></Link>
    </div>
  )

  return (
    <form className="booking-form" onSubmit={submit} aria-describedby={error ? 'form-error' : undefined}>
      <label className="field">Full name<input name="name" required maxLength={100} autoComplete="name" /></label>
      <label className="field">Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
      <label className="field">Phone<input name="phone" type="tel" required maxLength={30} pattern="[+\d\s\(\)\.\-]{7,30}" autoComplete="tel" /></label>
      <label className="field">Event type
        <select name="eventType" required defaultValue=""><option value="" disabled>Select one</option>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
      </label>
      <label className="field">Event date<input name="eventDate" type="date" min={today} /></label>
      <label className="field">Approximate guest count<input name="guestCount" type="number" min={1} max={100000} inputMode="numeric" /></label>
      <label className="field">Experience
        <select name="service" defaultValue={defaultService}><option value="">Not sure yet</option>{services.map((s) => <option key={s}>{s}</option>)}</select>
      </label>
      <label className="field">Budget <small>Optional — helps us shape your price plan</small><input name="budget" maxLength={60} placeholder="e.g. $1,500" /></label>
      <label className="field full">Tell us about your event<textarea name="message" rows={5} maxLength={3000} placeholder="The feeling, colors, guests and moments you want to create…" /></label>
      <div className="honeypot" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p id="form-error" className="form-error" role="alert">{error}</p>}
      <div className="full">
        <button className="button button-pink" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send inquiry'} <ArrowRight size={16} aria-hidden="true" /></button>
        <p className="fine-print">This is an inquiry, not a payment. Once your experience is confirmed, we will send a secure link for your deposit.</p>
      </div>
    </form>
  )
}
