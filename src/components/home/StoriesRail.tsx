import type { Update } from '../../payload-types'
import { mediaAlt, mediaUrl } from '../../lib/cms'
import { Button } from '../ui/button'
import { Container, SectionHeading } from '../ui/container'
import { StoriesRailClient, type StoryItem } from './StoriesRailClient'

/**
 * "HEAR OUR STORIES" — horizontal rail of expanding lozenge cards.
 *
 * Media URLs are resolved here on the server and passed down as plain strings.
 * The interactive rail is a client component, and lib/cms pulls in the Payload
 * config, so it must not cross that boundary.
 */
export function StoriesRail({ updates }: { updates: Update[] }) {
  if (updates.length === 0) return null

  const items: StoryItem[] = updates.map((update) => ({
    id: String(update.id),
    slug: update.slug ?? '',
    title: update.title,
    excerpt: update.excerpt ?? null,
    image: mediaUrl(update.coverImage, 'card'),
    alt: mediaAlt(update.coverImage),
  }))

  return (
    <section aria-labelledby="stories" className="py-16 sm:py-24">
      <Container>
        <SectionHeading as="h2" accent="Stories">
          Hear our
        </SectionHeading>
        <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-navy-600/70">
          Real accounts from the communities we work in — the people shaping their own health,
          and the outreach that reaches them.
        </p>
      </Container>

      <StoriesRailClient items={items} />

      <Container className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/updates" variant="secondary">
          See all updates
        </Button>
        <Button href="/get-involved" variant="ghost">
          Volunteer with us
        </Button>
      </Container>
    </section>
  )
}
