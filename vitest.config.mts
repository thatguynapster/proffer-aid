import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      // Mirrors the tsconfig paths. Next resolves these itself; vitest does not,
      // and anything importing lib/cms.ts pulls it in transitively.
      '@payload-config': path.resolve(dirname, 'src/payload.config.ts'),
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    // Access-control and webhook tests run against a real Payload instance and
    // a real database — mocking those layers would only test the mock. They are
    // slow by nature, hence the generous timeouts.
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 120_000,
    // Payload holds a single connection; parallel files would contend over it
    // and over the shared fixture users.
    fileParallelism: false,
    pool: 'forks',
  },
})
