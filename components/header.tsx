'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import { nav, site } from '@/lib/site'

// Sticky frosted bar. It stays light (not transparent) because the logo artwork has a white background.
export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const path = usePathname()

  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    // Hysteresis: separate on/off points so tiny scroll movements near the threshold can't flicker the state.
    const onScroll = () => setScrolled((was) => (was ? window.scrollY > 4 : window.scrollY > 24))
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey) }
  }, [])
  // Lock page scroll behind the open mobile menu.
  useEffect(() => { document.documentElement.classList.toggle('menu-open', open) }, [open])

  const current = (href: string) => (href === '/' ? path === '/' : path.startsWith(href)) ? 'page' : undefined
  const links = nav.map(([href, label]) => <Link key={href} href={href} aria-current={current(href)}>{label}</Link>)

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="The Mingle home"><Image src={site.logo} alt="The Mingle" width={222} height={102} priority /></Link>
        <nav className="desktop-nav" aria-label="Primary">
          {links}
          <Link className="nav-book" href="/booking" aria-current={current('/booking')}>Book now</Link>
        </nav>
        <button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label="Mobile">{links}</nav>
          <Link className="btn-pink btn-block" href="/booking">Book your date</Link>
          <div className="mobile-contact">
            <a href={site.phoneHref}><Phone size={16} aria-hidden="true" />{site.phone}</a>
            <a href={site.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" />WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  )
}
