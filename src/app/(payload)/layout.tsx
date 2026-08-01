import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { Inter } from 'next/font/google'
import React from 'react'

import { importMap } from './admin/importMap.js'

// Payload's own admin stylesheet. Without it the admin panel renders as
// unstyled markup — RootLayout ships no styles of its own. Must come before
// custom.scss so overrides there actually win.
import '@payloadcms/next/css'
import './custom.css'

/**
 * Same body face as the public site, self-hosted at build time.
 *
 * `RootLayout` renders its own `<html>`, so the only way to get a next/font
 * variable somewhere `--font-body` can consume it is `htmlProps` below — the
 * variable has to be defined at `:root`, not on a wrapper inside `<body>`.
 *
 * Only Inter. Anton stays on the public site: it is a condensed display face
 * built for all-caps headlines, and it would be actively hostile in a
 * data-dense CMS read for hours at a time.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    htmlProps={{ className: inter.variable }}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
