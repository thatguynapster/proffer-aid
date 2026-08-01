import Link from 'next/link'

import type { Campaign } from '../../payload-types'
import { mediaAlt, mediaUrl } from '../../lib/cms'
import { progressPercent } from '../../lib/campaigns'
import { PhotoSlot } from '../media/PhotoSlot'
import { ArrowButton } from '../ui/arrow-button'

export function CampaignCard({
  campaign,
  showProgress,
}: {
  campaign: Campaign
  showProgress: boolean
}) {
  const percent = progressPercent(campaign)
  const complete = campaign.status === 'completed'

  return (
    <article>
      <Link href={`/campaigns/${campaign.slug}`} className="group block">
        <PhotoSlot
          src={mediaUrl(campaign.heroImage, 'card')}
          alt={mediaAlt(campaign.heroImage)}
          need={`Hero image — ${campaign.title}`}
          spec="1200×900"
          sizes="(max-width: 640px) 100vw, 50vw"
          className="aspect-4/3 w-full rounded-card"
        />

        <div className="mt-5 flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
              {complete ? 'Completed' : 'Active campaign'}
            </p>
            <h3 className="mt-2 text-lg leading-snug font-semibold text-balance text-navy-600 group-hover:text-ochre">
              {campaign.title}
            </h3>
            {campaign.summary ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-600/70">
                {campaign.summary}
              </p>
            ) : null}

            {showProgress ? (
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-pill bg-navy-600/10">
                  <div
                    className={`h-full rounded-pill ${complete ? 'bg-navy-600' : 'bg-gold-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-navy-600/55">{percent}% funded</p>
              </div>
            ) : null}
          </div>

          <ArrowButton label={campaign.title} className="mt-1" />
        </div>
      </Link>
    </article>
  )
}
