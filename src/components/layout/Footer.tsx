import Image from 'next/image'
import Link from 'next/link'

import { getSettings } from '../../lib/cms'
import { Container } from '../ui/Container'

const SITEMAP = [
  { href: '/what-we-do', label: 'What we do' },
  { href: '/updates', label: 'Updates' },
  { href: '/about', label: 'About' },
  { href: '/get-involved', label: 'Get involved' },
  { href: '/contact', label: 'Contact' },
]

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
}

export async function Footer() {
  const settings = await getSettings()
  const offices = settings?.offices ?? []
  const social = Object.entries(settings?.social ?? {}).filter(
    ([, url]) => typeof url === 'string' && url.length > 0,
  ) as [string, string][]

  return (
    <footer className="mt-24 bg-navy-600 pt-16 pb-8 text-cream">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/img/logo-square.png" alt="" width={48} height={48} className="size-11" />
              <p className="font-display text-xl leading-none">
                {settings?.orgName ?? 'Proffer Aid International Foundation'}
              </p>
            </div>
            {settings?.tagline ? (
              <p className="mt-4 max-w-sm text-sm text-cream/70">{settings.tagline}</p>
            ) : null}
            {settings?.mission ? (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/60">{settings.mission}</p>
            ) : null}
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold-500">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SITEMAP.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/75 hover:text-gold-500">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold-500">
              Our offices
            </h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {offices.map((office, index) => (
                <div key={office.id ?? index}>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-cream">
                    {office.name}
                  </p>
                  <p className="mt-1.5 text-sm whitespace-pre-line text-cream/65">
                    {office.addressLines}
                  </p>
                  {office.phone ? (
                    <a
                      href={`tel:${office.phone.replace(/\s/g, '')}`}
                      className="mt-1.5 block text-sm text-cream/75 hover:text-gold-500"
                    >
                      {office.phone}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream/50">
            © {new Date().getFullYear()} {settings?.orgName ?? 'Proffer Aid International Foundation'}
          </p>

          {social.length > 0 ? (
            <ul className="flex gap-5">
              {social.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cream/60 hover:text-gold-500"
                  >
                    {SOCIAL_LABELS[key] ?? key}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          <Link href="/privacy" className="text-xs text-cream/50 hover:text-gold-500">
            Privacy policy
          </Link>
        </div>
      </Container>
    </footer>
  )
}
