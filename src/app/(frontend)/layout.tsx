import type { Metadata } from 'next'
import { Anton, Inter } from 'next/font/google'
import React from 'react'

import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { donationsEnabled, getSettings } from '../../lib/cms'

import './globals.css'

/**
 * Anton stands in for the reference's condensed display face, which is almost
 * certainly a licensed family (Druk or similar). Anton is the closest free
 * match — heavy, condensed, flat terminals, built for all-caps.
 *
 * Both faces are self-hosted at build time by next/font, so there is no
 * runtime request to Google. That matters for the low-bandwidth Ghanaian
 * traffic this site is built for, and removes a third-party dependency.
 */
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings?.orgName ?? 'Proffer Aid International Foundation'
  const description =
    settings?.mission ??
    'Proffer Aid International Foundation delivers mobile medical outreach to underserved communities across sub-Saharan Africa.'

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: name, template: `%s — ${name}` },
    description,
    openGraph: { title: name, description, type: 'website', siteName: name },
    icons: { icon: '/favicon.ico' },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const showDonate = await donationsEnabled()

  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-pill focus:bg-navy-600 focus:px-5 focus:py-2.5 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-widest focus:text-cream"
        >
          Skip to content
        </a>
        <Navbar showDonate={showDonate} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
