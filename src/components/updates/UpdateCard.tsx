import Link from 'next/link'

import type { Update } from '../../payload-types'
import { mediaAlt, mediaUrl } from '../../lib/cms'
import { categoryLabel, externalHref, formatUpdateDate, updateHref } from '../../lib/updates'
import { ArrowButton } from '../ui/arrow-button'
import { PhotoSlot } from '../media/PhotoSlot'

export function UpdateCard({ update, featured = false }: { update: Update; featured?: boolean }) {
  const href = updateHref(update)
  const external = externalHref(update)
  const date = formatUpdateDate(update.date)

  return (
    <article className={featured ? 'sm:col-span-2' : undefined}>
      <Link
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group block"
      >
        <PhotoSlot
          src={mediaUrl(update.coverImage, featured ? 'hero' : 'card')}
          alt={mediaAlt(update.coverImage)}
          need={`Cover image — ${update.title}`}
          spec={featured ? '1600×900' : '1200×900'}
          sizes={
            featured
              ? '(max-width: 640px) 100vw, 66vw'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          }
          className={`w-full rounded-card ${featured ? 'aspect-video' : 'aspect-4/3'}`}
        />

        <div className="mt-5 flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
                {categoryLabel(update.category)}
              </p>
              {date ? (
                <time dateTime={update.date ?? undefined} className="text-xs text-navy-600/50">
                  {date}
                </time>
              ) : null}
            </div>

            <h3
              className={`mt-2 font-semibold text-balance text-navy-600 group-hover:text-ochre ${featured ? 'font-display text-display-sm' : 'text-lg leading-snug'
                }`}
            >
              {update.title}
            </h3>

            {update.excerpt ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-600/70">
                {update.excerpt}
              </p>
            ) : null}

            {external ? (
              <p className="mt-3 text-xs text-navy-600/50">
                Published by {update.externalSource?.publication || 'an external source'}
                <span className="sr-only"> (opens in a new tab)</span>
              </p>
            ) : null}
          </div>

          <ArrowButton label={update.title} className="mt-1" />
        </div>
      </Link>
    </article>
  )
}
