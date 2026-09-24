'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { nav, site } from '@/lib/site'

export default function Header() {
  const [open, setOpen] = useState(false)
  const path = usePathname()
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const current = (href: string) => (href === '/' ? path === '/' : path.startsWith(href)) ? 'page' : undefined
  const links = nav.map(([href, label]) => <Link key={href} href={href} aria-current={current(href)}>{label}</Link>)
  const book = <Link className="nav-book" href="/booking" aria-current={current('/booking')}>Book now</Link>
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="The Mingle home"><Image src={site.logo} alt="The Mingle" width={222} height={102} priority /></Link>
      <nav className="desktop-nav" aria-label="Primary">{links}{book}</nav>
      <button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      {open && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">{links}{book}</nav>}
    </header>
  )
}
