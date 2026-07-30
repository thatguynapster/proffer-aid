import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Access-control tests run against a real Payload instance and a real
    // database — mocking the access layer would only test the mock. They are
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
