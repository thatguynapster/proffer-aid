import Link from 'next/link'

import type { Update } from '../../payload-types'
import { mediaAlt, mediaUrl } from '../../lib/cms'
import { ArrowButton } from '../ui/arrow-button'
import { Container } from '../ui/container'
import { PhotoSlot } from '../media/PhotoSlot'

const CATEGORY_LABELS: Record<string, string> = {
  outreach: 'Outreach',
  partnership: 'Partnership',
  campaign: 'Campaign',
}

/** Three-up strip of recent updates beneath the hero. */
export function UpdateStrip({ updates }: { updates: Update[] }) {
  if (updates.length === 0) return null

  return (
    <section aria-labelledby="recent-updates" className="border-t border-navy-600/10 py-8 sm:py-10">
      <Container width="wide">
        <h2 id="recent-updates" className="sr-only">
          Recent updates
        </h2>
        <ul className="rail -mx-1 flex snap-x gap-4 overflow-x-auto px-1 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible">
          {updates.slice(0, 3).map((update) => {
            const cover = mediaUrl(update.coverImage, 'thumbnail')
            return (
              <li
                key={update.id}
                className="w-[78vw] shrink-0 snap-start sm:w-[48vw] lg:w-auto"
              >
                <Link href={`/updates/${update.slug}`} className="group flex items-center gap-3.5">
                  <PhotoSlot
                    src={cover}
                    alt={mediaAlt(update.coverImage)}
                    need={`Cover image — ${update.title}`}
                    spec="800×800"
                    sizes="80px"
                    className="size-14 shrink-0 rounded-full"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
                      {CATEGORY_LABELS[update.category] ?? update.category}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm leading-snug font-semibold text-navy-600 group-hover:text-ochre">
                      {update.title}
                    </p>
                  </div>
                  <ArrowButton label={`Read: ${update.title}`} />
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
