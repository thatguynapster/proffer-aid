'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '../ui/button'

const LINKS = [
  { href: '/what-we-do', label: 'What we do' },
  { href: '/updates', label: 'Updates' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar({ showDonate }: { showDonate: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Route change should never leave the mobile panel hanging open.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-navy-600/10 bg-cream/95 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-4 px-5 sm:h-20 sm:px-8"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Proffer Aid — home">
          <Image
            src="/img/logo-square.png"
            alt=""
            width={40}
            height={40}
            className="size-8 sm:size-9"
            priority
          />
          <span className="font-display text-sm leading-none text-navy-600 sm:text-base">
            Proffer Aid
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                    active ? 'text-ochre' : 'text-navy-600 hover:text-ochre'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button href="/get-involved" variant="secondary" size="md" className="hidden sm:inline-flex">
            Get involved
          </Button>
          {showDonate ? (
            <Button href="/donate" variant="primary" size="md" className="hidden sm:inline-flex">
              Donate
            </Button>
          ) : null}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex size-10 items-center justify-center rounded-full border border-navy-600/25 text-navy-600 lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-nav" className="border-t border-navy-600/10 bg-cream lg:hidden">
          <ul className="flex flex-col px-5 py-2 sm:px-8">
            {LINKS.map((link) => (
              <li key={link.href} className="border-b border-navy-600/8 last:border-0">
                <Link
                  href={link.href}
                  className="block py-4 font-display text-2xl text-navy-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 px-5 pb-6 sm:px-8">
            <Button href="/get-involved" variant="secondary">
              Get involved
            </Button>
            {showDonate ? <Button href="/donate">Donate</Button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
