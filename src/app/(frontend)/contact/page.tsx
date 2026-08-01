import type { Metadata } from 'next'

import { PageHero } from '../../../components/layout/PageHero'
import { RichText } from '../../../components/RichText'
import { Container } from '../../../components/ui/container'
import { getSettings } from '../../../lib/cms'
import { getPage, getPageOr404, pageMetadata } from '../../../lib/pages'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage('contact'), 'Contact')
}

export default async function ContactPage() {
  const page = await getPageOr404('contact')
  const settings = await getSettings()
  const offices = settings?.offices ?? []

  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact" accent="Us" />

      <Container width="narrow" className="pt-14 sm:pt-20">
        <RichText data={page.body} />
      </Container>

      {/* Two offices — Italy HQ and the Ghana branch. Rendered from
          SiteSettings so PAIF can correct addresses without a deploy. */}
      <Container className="py-14 sm:py-20">
        <ul className="grid gap-5 sm:grid-cols-2">
          {offices.map((office, index) => (
            <li
              key={office.id ?? index}
              className="rounded-card bg-paper p-7 shadow-[0_1px_2px_rgba(16,16,96,0.04),0_8px_24px_-12px_rgba(16,16,96,0.12)]"
            >
              <h2 className="font-display text-xl text-navy-600">{office.name}</h2>

              <address className="mt-4 space-y-3 text-sm not-italic text-navy-600/75">
                <p className="whitespace-pre-line">{office.addressLines}</p>

                {office.phone ? (
                  <p>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
                      Phone
                    </span>
                    <br />
                    <a
                      href={`tel:${office.phone.replace(/\s/g, '')}`}
                      className="hover:text-ochre hover:underline"
                    >
                      {office.phone}
                    </a>
                  </p>
                ) : null}

                {office.hours ? (
                  <p>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
                      Hours
                    </span>
                    <br />
                    {office.hours}
                  </p>
                ) : null}
              </address>

              {office.mapUrl ? (
                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-ochre hover:underline"
                >
                  View on map
                </a>
              ) : null}
            </li>
          ))}
        </ul>

        {settings?.notificationEmail ? (
          <p className="mt-10 text-center text-sm text-navy-600/70">
            General enquiries:{' '}
            <a
              href={`mailto:${settings.notificationEmail}`}
              className="text-ochre underline decoration-gold-500 decoration-2 underline-offset-2"
            >
              {settings.notificationEmail}
            </a>
          </p>
        ) : null}
      </Container>
    </>
  )
}
