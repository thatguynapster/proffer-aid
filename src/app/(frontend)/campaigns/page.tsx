import type { Metadata } from 'next'

import { CampaignCard } from '../../../components/campaigns/CampaignCard'
import { PageHero } from '../../../components/layout/PageHero'
import { Button } from '../../../components/ui/Button'
import { Container } from '../../../components/ui/Container'
import { listCampaigns } from '../../../lib/campaigns'
import { donationsEnabled } from '../../../lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Campaigns',
  description:
    'Fundraising campaigns from Proffer Aid International Foundation — what we are raising for, and how far we have got.',
}

export default async function CampaignsPage() {
  const [campaigns, showProgress] = await Promise.all([listCampaigns(), donationsEnabled()])

  return (
    <>
      <PageHero
        eyebrow="Support a project"
        title="Our"
        accent="Campaigns"
        subtitle="What we are raising for, and how far we have got."
      />

      <Container className="py-14 sm:py-20">
        {campaigns.length === 0 ? (
          // No campaigns exist yet. The collection ships ready so PAIF can
          // publish the Amasaman Centre page themselves the moment its figures
          // are confirmed — no developer involvement (PRD §2.6).
          <div className="mx-auto max-w-md text-center">
            <p className="font-display text-display-sm text-navy-600">No open campaigns</p>
            <p className="mt-4 text-sm leading-relaxed text-navy-600/70">
              There are no active fundraising campaigns at the moment. Our outreach continues
              year-round — follow our updates, or get in touch about supporting the work.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/updates" variant="secondary">
                Read our updates
              </Button>
              <Button href="/get-involved" variant="ghost">
                Get involved
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} showProgress={showProgress} />
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
