/**
 * Re-uploads every existing media document's file to whichever storage adapter
 * is currently configured.
 *
 *   npm run seed:media
 *
 * Why this exists: media uploaded before S3 credentials were added lands on the
 * local filesystem, and configuring S3 afterwards is not retroactive. The main
 * seed deduplicates on filename, so re-running it skips those records rather
 * than re-uploading them.
 *
 * This updates each document in place via payload.update({ filePath }), which
 * swaps the underlying file while keeping the same document id — so
 * TeamMembers → photo relationships survive. Deleting and re-creating the
 * records would break them.
 *
 * Safe to re-run. Idempotent in effect, though it always re-uploads.
 */

import path from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const MEDIA_DIR = path.resolve(dirname, '../../docs/salvage/media')

try {
  process.loadEnvFile()
} catch {
  // Rely on already-set environment variables.
}

/** Uploads are converted to WebP, so a document's filename no longer matches
 *  its source. Recover the original by trying the plausible extensions. */
function findSource(storedFilename: string): string | null {
  const stem = storedFilename.replace(/\.[^.]+$/, '')
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp', '.gif']) {
    const candidate = path.join(MEDIA_DIR, stem + ext)
    if (existsSync(candidate)) return candidate
  }
  return null
}

async function main() {
  const s3Configured = Boolean(
    process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
  )
  console.log(`\n  Storage adapter: ${s3Configured ? `S3 (${process.env.S3_BUCKET})` : 'LOCAL DISK'}`)
  if (!s3Configured) {
    console.log('  Set S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY to target S3.\n')
  }

  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'media',
    limit: 500,
    pagination: false,
    overrideAccess: true,
  })

  if (docs.length === 0) {
    console.log('  No media documents found. Run `npm run seed` first.\n')
    process.exit(0)
  }

  let ok = 0
  const failed: string[] = []

  for (const doc of docs) {
    const stored = String(doc.filename ?? '')
    const source = findSource(stored)

    if (!source) {
      failed.push(`${stored} — no source file found in docs/salvage/media`)
      continue
    }

    try {
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {},
        filePath: source,
        overrideAccess: true,
      })
      console.log(`  + ${stored.padEnd(26)} <- ${path.basename(source)}`)
      ok++
    } catch (error) {
      failed.push(`${stored} — ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  console.log(`\n  Re-uploaded ${ok} of ${docs.length}.`)
  if (failed.length) {
    console.log('\n  Failed:')
    failed.forEach((f) => console.log(`    ! ${f}`))
  }
  if (ok > 0 && s3Configured) {
    console.log(
      '\n  The local media/ folder is now stale and can be deleted — it is gitignored.\n',
    )
  }

  process.exit(failed.length > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('\n  Re-upload failed:', error)
  process.exit(1)
})
