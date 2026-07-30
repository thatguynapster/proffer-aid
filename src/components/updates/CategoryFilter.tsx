import Link from 'next/link'

import { UPDATE_CATEGORIES } from '../../lib/updates'

/**
 * Category filter as plain links to `/updates?category=…`.
 *
 * No client JavaScript: the filter works with JS disabled, each view is a real
 * shareable URL, and back/forward behave the way people expect. That matters
 * more than usual for the bandwidth-constrained mobile traffic this site
 * targets.
 */
export function CategoryFilter({ active }: { active?: string }) {
  const options = [{ value: '', label: 'All' }, ...UPDATE_CATEGORIES]

  return (
    <nav aria-label="Filter updates by category" className="flex flex-wrap justify-center gap-2">
      {options.map((option) => {
        const selected = (active ?? '') === option.value
        const href = option.value ? `/updates?category=${option.value}` : '/updates'

        return (
          <Link
            key={option.value || 'all'}
            href={href}
            aria-current={selected ? 'page' : undefined}
            className={`rounded-pill border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
              selected
                ? 'border-navy-600 bg-navy-600 text-cream'
                : 'border-navy-600/25 text-navy-600 hover:border-navy-600 hover:bg-navy-600/5'
            }`}
          >
            {option.label}
          </Link>
        )
      })}
    </nav>
  )
}
