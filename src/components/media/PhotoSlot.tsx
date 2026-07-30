import Image from 'next/image'
import React from 'react'

/**
 * Renders a photo if one exists, or an explicit, obviously-synthetic
 * placeholder if it does not.
 *
 * PAIF's recovered image library has roughly four usable outreach photos
 * against a design that needs twenty-plus. Rather than filling the gap with
 * stock photography of people who are not PAIF's beneficiaries — misleading on
 * an NGO site — every gap renders as a labelled slot stating what is needed and
 * at what resolution. The layout stays reviewable, nothing deceptive ships, and
 * the shot list is visible in situ instead of buried in a document.
 */

export type PhotoSlotProps = {
  /** Resolved image URL, if one exists. */
  src?: string | null
  alt?: string | null
  /** What this slot needs, e.g. "Portrait — volunteer at a screening". */
  need: string
  /** Target dimensions to request from PAIF, e.g. "1200×1600". */
  spec?: string
  className?: string
  sizes?: string
  priority?: boolean
  /** Renders the label in cream for use over dark sections. */
  onDark?: boolean
}

export function PhotoSlot({
  src,
  alt,
  need,
  spec,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  onDark = false,
}: PhotoSlotProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder — photograph needed: ${need}`}
      className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden p-4 text-center ${
        onDark ? 'bg-navy-700 text-cream/70' : 'bg-navy-600/8 text-navy-600/60'
      } ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 9px, ${
          onDark ? 'rgba(242,240,235,0.05)' : 'rgba(16,16,96,0.045)'
        } 9px, ${onDark ? 'rgba(242,240,235,0.05)' : 'rgba(16,16,96,0.045)'} 18px)`,
      }}
    >
      <svg viewBox="0 0 24 24" className="size-6 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m3 16 5-4 4 3 3-2 6 4" strokeLinejoin="round" />
      </svg>
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em]">Photo needed</p>
      <p className="max-w-[22ch] text-[0.6875rem] leading-snug">{need}</p>
      {spec ? <p className="text-[0.625rem] tabular-nums opacity-70">{spec}</p> : null}
    </div>
  )
}

/**
 * The hero wordmark fill. Photos are masked inside the letterforms via
 * background-clip: text, which keeps the wordmark as real selectable text.
 *
 * Contrast caveat: letters filled with varying photography can drop below
 * 4.5:1 in patches, so the fill image carries a navy multiply overlay to
 * guarantee the floor, and a solid navy fallback applies wherever
 * background-clip: text is unsupported.
 */
export function WordmarkFill({
  src,
  children,
  className = '',
}: {
  src?: string | null
  children: React.ReactNode
  className?: string
}) {
  if (!src) {
    return <span className={`text-navy-600 ${className}`}>{children}</span>
  }

  return (
    <span
      className={`bg-navy-600 bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(16,16,96,0.45), rgba(16,16,96,0.45)), url(${src})`,
        // `cover` on the element's box, so the caller controls the crop by
        // sizing that box. Note the box must be at least as tall as the
        // letterforms or the uncovered glyph areas paint nothing and read as
        // clipped text — see the note at the Hero call site.
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </span>
  )
}
