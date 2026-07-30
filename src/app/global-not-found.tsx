import { Anton, Inter } from 'next/font/google'

import './(frontend)/globals.css'

/**
 * 404 for URLs that match no route at all.
 *
 * `(frontend)/not-found.tsx` only covers paths inside that route group — it
 * handles a `notFound()` thrown by a real route, such as an unpublished page or
 * a missing update slug. A URL matching nothing has no group and therefore no
 * layout, so this file must be entirely self-contained: its own html and body,
 * its own fonts and styles.
 */
const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-anton' })
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata = {
  title: 'Page not found — Proffer Aid International Foundation',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-24 text-center font-sans">
        <p className="font-display text-display-lg leading-none text-gold-500">404</p>

        <h1 className="mt-6 font-display text-display-sm text-navy-600 sm:text-display-md">
          We can&rsquo;t find that page
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-navy-600/70">
          The address may be wrong, or the page may have moved.
        </p>

        <a
          href="/"
          className="mt-9 inline-flex items-center justify-center rounded-pill bg-gold-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-navy-600 hover:bg-gold-400"
        >
          Back to home
        </a>
      </body>
    </html>
  )
}
