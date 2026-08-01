import { Container } from '../ui/container'
import { Eyebrow } from '../ui/container'

/**
 * Shared page header. Keeps interior pages in the homepage's typographic
 * language — heavy condensed display type with an optional ochre accent word —
 * without repeating the hero's image-in-text treatment, which is reserved for
 * the homepage so it stays a signature rather than a motif.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
}: {
  eyebrow?: string
  title: string
  accent?: string
  subtitle?: string | null
}) {
  return (
    <section className="border-b border-navy-600/10 pt-14 pb-12 sm:pt-20 sm:pb-16">
      <Container>
        {eyebrow ? <Eyebrow className="text-center">{eyebrow}</Eyebrow> : null}
        <h1
          className={`font-display text-display-sm sm:text-display-md lg:text-display-lg text-center text-balance text-navy-600 ${
            eyebrow ? 'mt-4' : ''
          }`}
        >
          {title}
          {accent ? <span className="text-ochre"> {accent}</span> : null}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-navy-600/70 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  )
}
