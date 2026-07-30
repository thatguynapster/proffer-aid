'use client'

import Link from 'next/link'
import { useState } from 'react'

import { PhotoSlot } from '../media/PhotoSlot'

export type StoryItem = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  image: string | null
  alt: string
}

/**
 * Expanding lozenge rail.
 *
 * One card is expanded at a time — hovering (or focusing) a collapsed card
 * expands it and collapses whatever was open, so there is never more than one
 * wide card. That needs shared state, hence a client component; pure CSS
 * `:hover` can grow a card but cannot shrink its siblings.
 *
 * The first card is expanded by default so the section reads correctly before
 * any interaction, and on touch devices where hover never fires.
 *
 * Layout: the scroll container is full width and the track inside it is
 * `w-max mx-auto`, which centres the row to match the container-bound sections
 * above and below, then degrades to ordinary left-aligned scrolling once the
 * content outgrows the viewport — `mx-auto` simply stops applying at that
 * point. Deliberately not `justify-center`, which combined with overflow makes
 * the overflowing left portion unreachable by scrolling.
 */
export function StoriesRailClient({ items }: { items: StoryItem[] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="rail mt-12 overflow-x-auto pb-2" onMouseLeave={() => setActive(0)}>
      <ul className="mx-auto flex w-max snap-x gap-3 px-5 sm:px-8">
        {items.map((item, index) => {
          const expanded = index === active
          return (
            <li
              key={item.id}
              onMouseEnter={() => setActive(index)}
              className={`h-[26rem] shrink-0 snap-center transition-[width] duration-500 ease-out ${
                expanded ? 'w-[80vw] sm:w-[34rem]' : 'w-[9rem] sm:w-[11rem]'
              }`}
            >
              <Link
                href={`/updates/${item.slug}`}
                onFocus={() => setActive(index)}
                aria-current={expanded ? 'true' : undefined}
                className={`group relative isolate flex h-full w-full overflow-hidden transition-[border-radius] duration-500 ease-out ${
                  expanded ? 'rounded-[3rem]' : 'rounded-lozenge'
                }`}
              >
                <PhotoSlot
                  src={item.image}
                  alt={item.alt}
                  need={`Cover image — ${item.title}`}
                  spec={expanded ? '1200×900' : '800×1200'}
                  sizes="(max-width: 640px) 80vw, 544px"
                  className="h-full w-full"
                  onDark
                />

                {/* Caption only when expanded — unreadable at 9rem wide. */}
                <div
                  aria-hidden={!expanded}
                  className={`absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-900/90 via-navy-900/60 to-transparent p-6 pt-16 transition-opacity duration-300 ${
                    expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  <p className="font-display text-xl text-cream">{item.title}</p>
                  {item.excerpt ? (
                    <p className="mt-2 line-clamp-3 max-w-sm text-sm leading-snug text-cream/80">
                      {item.excerpt}
                    </p>
                  ) : null}
                </div>

                {/* Collapsed cards still need an accessible name. */}
                <span className="sr-only">{item.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
