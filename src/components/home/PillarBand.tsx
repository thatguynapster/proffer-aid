import { PhotoSlot } from '../media/PhotoSlot'

/**
 * Full-bleed photo band with stroke-outlined display type over it — the
 * "EQUAL RIGHTS / CHILD PROTECTION / SAVE PLANET" treatment from the reference.
 *
 * Uses PAIF's own five pillars. The first line is solid for legibility and the
 * rest are outlined, which is what creates the receding effect. A navy scrim
 * sits over the photograph so the type keeps its contrast floor regardless of
 * what the image underneath is doing.
 */
const PILLARS = ['Advocating', 'Partnering', 'Establishing', 'Upgrading', 'Organising']

export function PillarBand() {
  return (
    <section aria-labelledby="pillars" className="relative isolate overflow-hidden">
      <PhotoSlot
        src="/img/photos/awareness-event.jpg"
        alt=""
        need="Wide documentary shot — community outreach in progress"
        spec="2400×1200"
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full"
        onDark
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-600/70" />

      <div className="mx-auto flex min-h-[26rem] max-w-6xl flex-col justify-center px-5 py-20 sm:px-8 sm:py-28">
        <h2 id="pillars" className="sr-only">
          How we work
        </h2>
        <ul className="space-y-0.5">
          {PILLARS.map((pillar, index) => (
            <li
              key={pillar}
              className={`font-display text-display-sm sm:text-display-md lg:text-display-lg leading-[0.95] ${
                index === 0 ? 'text-cream' : 'text-stroke-cream'
              }`}
            >
              {pillar}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-cream/80 sm:text-base">
          Five ways we work to close the gap between health care and the people who need it —
          across rural communities where services are deficient, inefficient or simply absent.
        </p>
      </div>
    </section>
  )
}
