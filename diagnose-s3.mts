// Temporary diagnostic — delete after use.
process.loadEnvFile()

import { existsSync, readdirSync } from 'fs'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

console.log('\n--- Local disk ---')
for (const dir of ['media', 'src/media', 'public/media']) {
  if (existsSync(dir)) {
    console.log(`  ${dir}/  ->  ${readdirSync(dir).join(', ') || '(empty)'}`)
  } else {
    console.log(`  ${dir}/  ->  does not exist`)
  }
}

console.log('\n--- S3 bucket ---')
const client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

try {
  const res = await client.send(new ListObjectsV2Command({ Bucket: process.env.S3_BUCKET! }))
  const contents = res.Contents ?? []
  console.log(`  ${contents.length} object(s) in ${process.env.S3_BUCKET}`)
  for (const o of contents) {
    console.log(`    ${o.Key}  (${o.Size} bytes)`)
  }
} catch (e) {
  console.log(`  ERROR listing bucket: ${(e as Error).name} — ${(e as Error).message}`)
}

process.exit(0)
