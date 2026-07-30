import { Button } from '../ui/Button'
import { PhotoSlot } from '../media/PhotoSlot'

/**
 * Closing call to action over a full-bleed photograph — the "HELP VOICES BE
 * HEARD" band from the reference.
 *
 * Adapts to whether donations are live. With `donationsEnabled` off there is no
 * donate CTA anywhere on the site, so this band pivots to volunteering and
 * in-kind giving instead of showing a dead button or a "coming soon" notice.
 */
export function SupportBand({
  showDonate,
  impactFraming,
}: {
  showDonate: boolean
  impactFraming?: string | null
}) {
  return (
    <section aria-labelledby="support" className="relative isolate overflow-hidden">
      <PhotoSlot
        src="/img/photos/virtual-discussion.jpg"
        alt=""
        need="Wide shot — health education session or community gathering"
        spec="2400×1200"
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full"
        onDark
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-600/80" />

      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <h2 id="support" className="font-display text-display-sm sm:text-display-md text-cream">
          {showDonate ? 'Help us reach further' : 'Join the work'}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
          {showDonate
            ? (impactFraming ??
              'Proffer Aid runs on the generosity of individuals and partner organisations. Every contribution extends how far a mobile clinic can travel.')
            : 'Proffer Aid runs on volunteers, partners and in-kind support — medical equipment, pharmaceuticals, and the professional expertise of people who give their time.'}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {showDonate ? <Button href="/donate">Donate now</Button> : null}
          <Button href="/get-involved" variant={showDonate ? 'onDark' : 'primary'}>
            Get involved
          </Button>
          {!showDonate ? (
            <Button href="/contact" variant="onDark">
              Offer support
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
