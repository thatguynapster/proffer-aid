import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { WordmarkFill } from '../media/PhotoSlot'

/**
 * Hero wordmark with photography masked inside the letterforms.
 *
 * "PROFFER / AID" rather than the full organisation name — the effect depends
 * on a short wordmark filling two chunky lines, and "Proffer Aid International
 * Foundation" would collapse into eight lines of small type and lose it
 * entirely. The full name carries in the nav, footer and metadata.
 *
 * The fill is a real PAIF outreach photograph, not stock. Accessibility: the
 * wordmark stays real selectable text, and the fill carries a navy multiply
 * overlay so contrast can't drift below the floor as the image varies.
 */
export function Hero({
  tagline,
  showDonate,
}: {
  tagline?: string | null
  showDonate: boolean
}) {
  return (
    <section className="pt-10 pb-4 sm:pt-16">
      <Container width="wide">
        <h1 className="sr-only">
          Proffer Aid International Foundation{tagline ? ` — ${tagline}` : ''}
        </h1>

        {/*
          Line spacing is controlled by the flex `gap`, not by line-height.
          Anton's line box is much taller than its caps, so tuning a single
          line-height either collapses the lines into each other or leaves a
          gap far larger than it looks like it should. Splitting the two lets
          `leading` set how tight each line's own box is, and `gap` set the
          space between them — independently, and predictably.
        */}
        <div
          aria-hidden="true"
          className="flex flex-col items-center gap-[0.08em] text-[22vw] leading-[0.78] sm:text-[19vw] lg:text-[17vw]"
        >
          <WordmarkFill src="/img/photos/outreach-screening.jpg" className="font-display block tracking-[-0.02em]">
            Proffer
          </WordmarkFill>
          <WordmarkFill src="/img/photos/outreach-screening.jpg" className="font-display block tracking-[-0.02em]">
            Aid
          </WordmarkFill>
        </div>

        {tagline ? (
          <p className="mx-auto mt-5 max-w-xl text-center text-base text-navy-600/70 sm:mt-7 sm:text-lg">
            {tagline}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          {showDonate ? <Button href="/donate">Donate</Button> : null}
          <Button href="/get-involved" variant={showDonate ? 'secondary' : 'primary'}>
            Get involved
          </Button>
        </div>
      </Container>
    </section>
  )
}
