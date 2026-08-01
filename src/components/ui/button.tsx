import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * shadcn Button, restyled to the PAIF design system.
 *
 * Structure is shadcn's — cva variants, `asChild` via Radix Slot, `data-slot`
 * hooks — so `npx shadcn add` conventions still apply and the component stays
 * recognisable. Every visual value is ours: pill radius, uppercase with wide
 * tracking, and a gold primary.
 *
 * PRIMARY IS GOLD WITH NAVY TEXT, not `bg-primary`. That mirrors the logo (gold
 * ring, navy letters) and clears AA comfortably. It deliberately does not use
 * the `--primary` token, which is navy: shadcn's `link` variant renders
 * `text-primary`, and gold text on cream is ~1.5:1 — it fails at every size.
 * Gold is a fill here and nothing else. See the contrast rule in globals.css.
 *
 * `href` renders a next/link and is how nearly every call site uses this.
 * `asChild` is kept for the admin panel, where the child is already a link.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-pill font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-gold-500 text-navy-600 hover:bg-gold-400 active:bg-gold-600',
        secondary:
          'border border-navy-600/25 text-navy-600 hover:border-navy-600 hover:bg-navy-600/5',
        ghost: 'text-navy-600 hover:bg-navy-600/5',
        // For placement on a navy or photographic ground, where navy text would
        // disappear.
        onDark: 'border border-cream/40 text-cream hover:bg-cream/10 hover:border-cream',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
      },
      size: {
        md: 'px-6 py-3 text-xs',
        lg: 'px-8 py-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    href?: string
  }

function Button({ className, variant, size, asChild = false, href, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }))

  if (href) {
    // Anything off-site opens in a new tab, with rel set so the new page cannot
    // reach back through window.opener.
    const external = href.startsWith('http')

    return (
      <Link
        href={href}
        className={classes}
        data-slot="button"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {props.children}
      </Link>
    )
  }

  const Comp = asChild ? Slot.Root : 'button'

  return <Comp data-slot="button" className={classes} {...props} />
}

export { Button, buttonVariants }
