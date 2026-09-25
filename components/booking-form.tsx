'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { EVENT_TYPES } from '@/lib/content'

export default function BookingForm({ services, defaultService = '', submitLabel = 'Send inquiry' }: { services: string[]; defaultService?: string; submitLabel?: string }) {
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
      <h2>Message sent — <span className="pink">thank you!</span></h2>
      <p>We have your event details and will be in touch shortly to talk through your vision and next steps.</p>
    </div>
  )

  return (
    <form onSubmit={submit} aria-describedby={error ? 'form-error' : undefined}>
      <div className="form-row"><label htmlFor="f-name">Your name</label><input id="f-name" name="name" required maxLength={100} autoComplete="name" placeholder="First and last name" /></div>
      <div className="form-grid">
        <div className="form-row"><label htmlFor="f-phone">Phone number</label><input id="f-phone" name="phone" type="tel" required maxLength={30} pattern="[+\d\s\(\)\.\-]{7,30}" autoComplete="tel" placeholder="Your phone number" /></div>
        <div className="form-row"><label htmlFor="f-email">Email</label><input id="f-email" name="email" type="email" required maxLength={160} autoComplete="email" placeholder="Your email address" /></div>
      </div>
      <div className="form-grid">
        <div className="form-row"><label htmlFor="f-type">Event type</label>
          <select id="f-type" name="eventType" required defaultValue=""><option value="" disabled>Select an event type…</option>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="form-row"><label htmlFor="f-service">Experience</label>
          <select id="f-service" name="service" defaultValue={defaultService}><option value="">Not sure yet</option>{services.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
      </div>
      <div className="form-grid">
        <div className="form-row"><label htmlFor="f-date">Event date</label><input id="f-date" name="eventDate" type="date" min={today} /></div>
        <div className="form-row"><label htmlFor="f-guests">Approximate guests</label><input id="f-guests" name="guestCount" type="number" min={1} max={100000} inputMode="numeric" placeholder="e.g. 75" /></div>
      </div>
      <div className="form-row"><label htmlFor="f-budget">Budget <small>(optional — helps us shape your price plan)</small></label><input id="f-budget" name="budget" maxLength={60} placeholder="e.g. $1,500" /></div>
      <div className="form-row"><label htmlFor="f-message">Tell us about your event</label><textarea id="f-message" name="message" maxLength={3000} placeholder="Location, colors, theme, any special requests…" /></div>
      <div className="honeypot" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p id="form-error" className="form-error" role="alert">{error}</p>}
      <button className="btn-pink btn-block" type="submit" disabled={state === 'sending'} style={{ padding: 16, fontSize: 13 }}>{state === 'sending' ? 'Sending…' : submitLabel}</button>
      <p className="form-note">This is an inquiry, not a payment. Once your experience is confirmed, we will send a secure link for your deposit.</p>
    </form>
  )
}
