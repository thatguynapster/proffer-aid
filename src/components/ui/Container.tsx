import React from 'react'

export function Container({
  children,
  className = '',
  width = 'default',
}: {
  children: React.ReactNode
  className?: string
  width?: 'default' | 'narrow' | 'wide'
}) {
  const widths = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-[90rem]',
  }
  return <div className={`mx-auto w-full ${widths[width]} px-5 sm:px-8 ${className}`}>{children}</div>
}

/**
 * Two-tone display heading — "OUR <accent>IMPACT</accent> IN ACTION".
 *
 * The accent word uses ochre rather than gold: gold on cream is ~1.5:1 and
 * fails AA at any size. See the contrast rule in globals.css.
 */
export function SectionHeading({
  children,
  accent,
  after,
  size = 'md',
  align = 'center',
  onDark = false,
  as: Tag = 'h2',
}: {
  children: string
  accent?: string
  after?: string
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'center'
  onDark?: boolean
  as?: 'h1' | 'h2' | 'h3'
}) {
  const sizes = {
    sm: 'text-display-sm',
    md: 'text-display-sm sm:text-display-md',
    lg: 'text-display-md sm:text-display-lg',
  }
  return (
    <Tag
      className={`font-display ${sizes[size]} ${align === 'center' ? 'text-center' : 'text-left'} ${
        onDark ? 'text-cream' : 'text-navy-600'
      } text-balance`}
    >
      {children}
      {accent ? <span className={onDark ? 'text-gold-500' : 'text-ochre'}> {accent}</span> : null}
      {after ? <span> {after}</span> : null}
    </Tag>
  )
}

/** Small uppercase category label. */
export function Eyebrow({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre ${className}`}
    >
      {children}
    </p>
  )
}
