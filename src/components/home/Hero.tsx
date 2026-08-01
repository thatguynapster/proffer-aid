import { Button } from '../ui/button'
import { Container } from '../ui/container'
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
          Two things are load-bearing here, both easy to break by "tidying".

          1. `background-clip: text` clips the background to the glyphs, but the
             background only paints inside the element's own box. A line-height
             tighter than the letterforms leaves the ascender and descender
             regions unpainted, which looks exactly like the text being cut off
             top and bottom. So the paint box is grown with `py-[0.18em]` and
             the space that padding would add is removed again with
             `-my-[0.18em]` — the box covers the glyphs, the layout is
             unaffected, and `leading` is free to stay tight.

          2. The fill lives on the wrapper, not on each word. One background
             across both lines means the photograph reads as a single
             continuous image behind PROFFER AID, rather than each word
             cropping its own copy independently.
        */}
        <div aria-hidden="true" className="text-[22vw] sm:text-[19vw] lg:text-[17vw]">
          <WordmarkFill
            src="/img/photos/outreach-screening.jpg"
            className="font-display block py-[0.18em] my-[-0.08em] text-center leading-none tracking-[-0.02em]"
          >
            <span className="block">Proffer</span>
            <span className="block mt-[-0.08em]">Aid</span>
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
