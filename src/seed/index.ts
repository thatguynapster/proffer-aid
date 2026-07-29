/**
 * Seeds the CMS with content recovered from the old profferaid.org.
 *
 *   npm run seed
 *
 * Idempotent: existing documents are left alone and reported as skipped, so
 * this is safe to re-run against a database that already has content. It never
 * updates or deletes anything — if you need to reseed a document, delete it in
 * the admin panel first.
 */

import path from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

import { NEEDS_CONFIRMATION, pages, siteSettings, teamMembers, updates } from './content'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const MEDIA_DIR = path.resolve(dirname, '../../docs/salvage/media')

// tsx does not load .env the way `next dev` does, so do it here.
//
// This must happen before payload.config is loaded, because that module reads
// process.env at import time. Static ESM imports are hoisted above module-body
// statements, so the config is imported dynamically inside main() instead —
// a static import would capture an empty PAYLOAD_SECRET and fail with a
// misleading "missing secret key".
try {
  process.loadEnvFile()
} catch {
  // No .env file — rely on already-set environment variables.
}

const created: string[] = []
const skipped: string[] = []
const failed: string[] = []

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    console.error('\n  DATABASE_URI and PAYLOAD_SECRET must be set. Copy .env.example to .env.\n')
    process.exit(1)
  }

  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  // --- Site settings -------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: siteSettings,
    overrideAccess: true,
  })
  created.push('global: site-settings')

  // --- Team members --------------------------------------------------------
  for (const member of teamMembers) {
    const existing = await payload.find({
      collection: 'team-members',
      where: { name: { equals: member.name } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) {
      skipped.push(`team-member: ${member.name}`)
      continue
    }

    let photoId: string | undefined
    if (member.photo) {
      photoId = await uploadMedia(payload, member.photo, `Portrait of ${member.name}`)
    }

    try {
      await payload.create({
        collection: 'team-members',
        data: {
          name: member.name,
          role: member.role,
          bio: member.bio,
          order: member.order,
          ...(photoId ? { photo: photoId } : {}),
        },
        overrideAccess: true,
      })
      created.push(`team-member: ${member.name}${photoId ? ' (with photo)' : ' (no photo)'}`)
    } catch (error) {
      failed.push(`team-member: ${member.name} — ${describe(error)}`)
    }
  }

  // --- Pages ---------------------------------------------------------------
  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      overrideAccess: true,
      draft: true,
    })

    if (existing.totalDocs > 0) {
      skipped.push(`page: ${page.slug}`)
      continue
    }

    try {
      await payload.create({
        collection: 'pages',
        data: {
          title: page.title,
          slug: page.slug,
          body: page.body,
          _status: page._status,
        },
        overrideAccess: true,
        draft: page._status === 'draft',
      })
      created.push(`page: ${page.slug}${page._status === 'draft' ? ' (DRAFT)' : ''}`)
    } catch (error) {
      failed.push(`page: ${page.slug} — ${describe(error)}`)
    }
  }

  // --- Updates -------------------------------------------------------------
  for (const update of updates) {
    const existing = await payload.find({
      collection: 'updates',
      where: { slug: { equals: update.slug } },
      limit: 1,
      overrideAccess: true,
      draft: true,
    })

    if (existing.totalDocs > 0) {
      skipped.push(`update: ${update.slug}`)
      continue
    }

    try {
      await payload.create({
        collection: 'updates',
        data: {
          title: update.title,
          slug: update.slug,
          date: new Date(update.date).toISOString(),
          category: update.category,
          excerpt: update.excerpt,
          body: update.body,
          _status: 'published',
        },
        overrideAccess: true,
      })
      created.push(`update: ${update.slug}`)
    } catch (error) {
      failed.push(`update: ${update.slug} — ${describe(error)}`)
    }
  }

  // Testimonials and Campaigns are intentionally NOT seeded. There is no real
  // testimonial content, and the Amasaman campaign's figures are unavailable.
  // Publishing invented quotes or fundraising numbers would be worse than
  // shipping those sections empty (PRD §10).

  report()
  process.exit(failed.length > 0 ? 1 : 0)
}

async function uploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filename: string,
  alt: string,
): Promise<string | undefined> {
  const filePath = path.join(MEDIA_DIR, filename)

  if (!existsSync(filePath)) {
    failed.push(`media: ${filename} not found at ${filePath}`)
    return undefined
  }

  try {
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) return String(existing.docs[0].id)

    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath,
      overrideAccess: true,
    })
    return String(doc.id)
  } catch (error) {
    // Upload failure must not abort the run — a team member without a photo is
    // still worth seeding.
    failed.push(`media: ${filename} — ${describe(error)}`)
    return undefined
  }
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function report() {
  const line = '─'.repeat(72)

  console.log(`\n${line}`)
  console.log(`  Seed complete — ${created.length} created, ${skipped.length} skipped`)
  console.log(line)

  if (created.length) {
    console.log('\n  Created:')
    created.forEach((item) => console.log(`    + ${item}`))
  }
  if (skipped.length) {
    console.log('\n  Skipped (already present):')
    skipped.forEach((item) => console.log(`    · ${item}`))
  }
  if (failed.length) {
    console.log('\n  Failed:')
    failed.forEach((item) => console.log(`    ! ${item}`))
  }

  console.log(`\n${line}`)
  console.log('  BEFORE LAUNCH — confirm with PAIF')
  console.log(line)
  NEEDS_CONFIRMATION.forEach((item, index) => {
    console.log(`\n  ${index + 1}. ${item}`)
  })
  console.log(
    '\n  Seeded copy is real recovered content, not filler — but it dates to' +
      '\n  roughly 2015 and has been lightly edited for typos. See' +
      '\n  docs/salvaged-content.md for provenance.\n',
  )
}

main().catch((error) => {
  console.error('\n  Seed failed:', error)
  process.exit(1)
})
