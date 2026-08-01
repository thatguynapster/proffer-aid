import type { Metadata } from 'next'

import { PageHero } from '../../../components/layout/PageHero'
import { CategoryFilter } from '../../../components/updates/CategoryFilter'
import { UpdateCard } from '../../../components/updates/UpdateCard'
import { Button } from '../../../components/ui/button'
import { Container } from '../../../components/ui/container'
import { UPDATE_CATEGORIES, categoryLabel, listUpdates } from '../../../lib/updates'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Updates',
  description:
    'Outreach reports, partnership news and campaign progress from Proffer Aid International Foundation.',
}

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams

  // Ignore unrecognised values rather than returning an empty list for a typo'd
  // or hand-edited query string.
  const category = UPDATE_CATEGORIES.some((c) => c.value === params.category)
    ? params.category
    : undefined

  const updates = await listUpdates({ category })
  const [featured, ...rest] = updates

  return (
    <>
      <PageHero
        eyebrow="News"
        title="Our"
        accent="Updates"
        subtitle="Outreach reports, partnership news and campaign progress from the communities we work in."
      />

      <Container className="py-12 sm:py-16">
        <CategoryFilter active={category} />

        {updates.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md text-center">
            <p className="font-display text-display-sm text-navy-600">Nothing here yet</p>
            <p className="mt-4 text-sm leading-relaxed text-navy-600/70">
              {category
                ? `No updates filed under ${categoryLabel(category)} so far.`
                : 'Updates will appear here as outreach and campaigns are published.'}
            </p>
            {category ? (
              <Button href="/updates" variant="secondary" className="mt-7">
                View all updates
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {/* Newest update runs wide, so the grid has a focal point rather
                than reading as an undifferentiated wall of cards. */}
            <UpdateCard update={featured} featured />
            {rest.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
