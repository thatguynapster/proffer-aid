import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DonateForm } from '../../../components/donate/DonateForm'
import { PageHero } from '../../../components/layout/PageHero'
import { RichText } from '../../../components/RichText'
import { Container } from '../../../components/ui/container'
import { donationsEnabled, getSettings } from '../../../lib/cms'
import { getCampaignById } from '../../../lib/campaigns'
import { getPage, pageMetadata } from '../../../lib/pages'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  if (!(await donationsEnabled())) return { title: 'Not found' }
  return pageMetadata(await getPage('donate'), 'Donate')
}

/**
 * 404s entirely when donations are switched off (PRD §10). Not a disabled
 * button and not a "coming soon" notice — the route simply does not exist, so
 * the site cannot appear to solicit donations it has no way to receive. The
 * sitemap omits it on the same condition, so nothing indexes a URL that 404s.
 */
export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string }>
}) {
  if (!(await donationsEnabled())) notFound()

  const [page, settings, params] = await Promise.all([
    getPage('donate'),
    getSettings(),
    searchParams,
  ])

  // A campaign id in the query string is only ever a hint. It is resolved
  // against the CMS here, so an unknown or deleted id degrades to a general
  // donation rather than attributing money to something that doesn't exist.
  const campaign = params.campaign ? await getCampaignById(params.campaign) : null

  return (
    <>
      <PageHero
        eyebrow="Support our work"
        title="Donate"
        subtitle={settings?.impactFraming ?? undefined}
      />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_26rem] lg:gap-16">
          <div>
            {page ? <RichText data={page.body} /> : null}

            {settings?.bankTransferDetails ? (
              <div className="mt-10 rounded-card border border-navy-600/15 p-6">
                <h2 className="font-display text-xl text-navy-600">Prefer a bank transfer?</h2>
                <p className="mt-3 text-sm whitespace-pre-line text-navy-600/75">
                  {settings.bankTransferDetails}
                </p>
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-card bg-paper p-7 shadow-[0_1px_2px_rgba(16,16,96,0.04),0_8px_24px_-12px_rgba(16,16,96,0.12)]">
              <h2 className="font-display text-2xl text-navy-600">Make a donation</h2>
              <div className="mt-5">
                <DonateForm
                  campaignId={campaign ? String(campaign.id) : undefined}
                  campaignTitle={campaign?.title}
                  feePercent={settings?.feePercent ?? 1.95}
                  feeCapPesewas={settings?.feeCapPesewas ?? 10000}
                />
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
