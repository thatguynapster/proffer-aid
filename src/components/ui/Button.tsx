import Link from 'next/link'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  // Gold fill with navy text — mirrors the logo (gold ring, navy letters) and
  // clears AA comfortably, unlike white-on-gold.
  primary: 'bg-gold-500 text-navy-600 hover:bg-gold-400 active:bg-gold-600',
  secondary: 'border border-navy-600/25 text-navy-600 hover:border-navy-600 hover:bg-navy-600/5',
  ghost: 'text-navy-600 hover:bg-navy-600/5',
  onDark: 'border border-cream/40 text-cream hover:bg-cream/10 hover:border-cream',
}

const SIZES: Record<Size, string> = {
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-pill font-semibold uppercase tracking-[0.08em] transition-colors duration-150 whitespace-nowrap'

type Props = {
  variant?: Variant
  size?: Size
  href?: string
  className?: string
  children: React.ReactNode
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Button({
  variant = 'primary',
  size = 'lg',
  href,
  className = '',
  children,
  ...rest
}: Props) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (href) {
    const external = href.startsWith('http')
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}

/** Circular ↗ affordance used on story and update cards. */
export function ArrowButton({
  label,
  className = '',
}: {
  label: string
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-9 shrink-0 items-center justify-center rounded-full border border-navy-600/25 transition-colors group-hover:border-navy-600 group-hover:bg-navy-600 group-hover:text-cream ${className}`}
      title={label}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 12L12 4M12 4H6M12 4v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
