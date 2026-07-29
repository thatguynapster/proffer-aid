import type { Metadata } from 'next'
import React from 'react'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'Proffer Aid International Foundation',
    template: '%s — Proffer Aid International Foundation',
  },
  description:
    'Proffer Aid International Foundation delivers mobile medical outreach to underserved communities across sub-Saharan Africa.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  )
}
