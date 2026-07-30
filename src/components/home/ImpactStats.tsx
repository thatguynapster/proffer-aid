import type { SiteSetting } from '../../payload-types'
import { Container, SectionHeading } from '../ui/Container'

/**
 * "OUR IMPACT IN ACTION" — big numerals in white cards with a gold "+".
 *
 * The `asOf` qualifier renders when set. Two of PAIF's three recovered counters
 * are point-in-time figures from roughly 2015; that field exists so they can be
 * published honestly rather than implied to be current.
 */
export function ImpactStats({
  counters,
  intro,
}: {
  counters: NonNullable<SiteSetting['impactCounters']>
  intro?: string | null
}) {
  if (!counters || counters.length === 0) return null

  return (
    <section aria-labelledby="impact" className="py-16 sm:py-24">
      <Container>
        <SectionHeading as="h2" accent="Impact" after="In Action" size="lg">
          Our
        </SectionHeading>
        {intro ? (
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-navy-600/70">
            {intro}
          </p>
        ) : null}

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {counters.map((counter, index) => (
            <li
              key={counter.id ?? index}
              className="flex min-h-56 flex-col justify-between rounded-card bg-paper p-7 shadow-[0_1px_2px_rgba(16,16,96,0.04),0_8px_24px_-12px_rgba(16,16,96,0.12)]"
            >
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-navy-600/55">
                {counter.label}
              </p>
              <p className="mt-8 font-display text-[3.5rem] leading-none text-navy-600 tabular-nums">
                {counter.value?.toLocaleString('en-GB')}
                <span className="text-gold-500">+</span>
              </p>
              {counter.asOf ? (
                <p className="mt-2 text-xs text-navy-600/50">{counter.asOf}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
