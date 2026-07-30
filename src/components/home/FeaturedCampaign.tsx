import type { Campaign } from '../../payload-types'
import { ProgressBar } from '../campaigns/ProgressBar'
import { PhotoSlot } from '../media/PhotoSlot'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { mediaAlt, mediaUrl } from '../../lib/cms'

/**
 * Home page campaign highlight, driven by `SiteSettings.featuredCampaign`.
 *
 * That field existed but nothing rendered it — the homepage promised a
 * "current campaign highlight" in the sitemap with no component behind it.
 * Renders nothing when unset, which is the current state until PAIF publish
 * their first campaign.
 */
export function FeaturedCampaign({
  campaign,
  showDonate,
}: {
  campaign: Campaign | null
  showDonate: boolean
}) {
  if (!campaign) return null

  return (
    <section aria-labelledby="featured-campaign" className="py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <PhotoSlot
            src={mediaUrl(campaign.heroImage, 'card')}
            alt={mediaAlt(campaign.heroImage)}
            need={`Hero image — ${campaign.title}`}
            spec="1200×900"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-4/3 w-full rounded-card"
          />

          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
              Current campaign
            </p>
            <h2
              id="featured-campaign"
              className="mt-3 font-display text-display-sm sm:text-display-md text-balance text-navy-600"
            >
              {campaign.title}
            </h2>
            {campaign.summary ? (
              <p className="mt-4 text-base leading-relaxed text-navy-600/70">{campaign.summary}</p>
            ) : null}

            <div className="mt-7">
              <ProgressBar campaign={campaign} showTotals={showDonate} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`/campaigns/${campaign.slug}`} variant={showDonate ? 'secondary' : 'primary'}>
                Read the full story
              </Button>
              {showDonate ? (
                <Button href={`/donate?campaign=${campaign.id}`}>Donate</Button>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
