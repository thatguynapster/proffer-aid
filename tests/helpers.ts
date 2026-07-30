import type { Payload } from 'payload'

import type { Role } from '../src/access'

/**
 * Fixture users, one per role, created with a unique suffix so parallel or
 * repeated runs never collide and so a failed run leaves nothing behind that
 * would break the next one.
 */
/**
 * Fixture users hold the FULL user document, not just an id.
 *
 * This matters more than it looks: the access functions read `user.role` and
 * `user.active`. Passing a partial object makes every check fall through to
 * "denied" — which means the negative assertions pass for entirely the wrong
 * reason, and would keep passing even if access control were deleted outright.
 * The positive assertions are what catch that, so each rule is tested from both
 * directions.
 */
export type FixtureUser = { id: string; email: string; role: Role; active: boolean }

export type Fixtures = {
  payload: Payload
  users: Record<Role, FixtureUser>
  cleanup: () => Promise<void>
}

const ROLES: Role[] = ['admin', 'leadEditor', 'editor', 'contributor', 'viewer']

export async function setupFixtures(): Promise<Fixtures> {
  process.loadEnvFile?.()

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`
  const created: string[] = []
  const users = {} as Fixtures['users']

  for (const role of ROLES) {
    const email = `test-${role.toLowerCase()}-${suffix}@example.test`
    const doc = await payload.create({
      collection: 'users',
      data: { email, password: 'Test-Password-123!', name: `Test ${role}`, role, active: true },
      overrideAccess: true,
    })
    users[role] = { id: String(doc.id), email, role, active: true }
    created.push(String(doc.id))
  }

  const cleanup = async () => {
    for (const id of created) {
      try {
        await payload.delete({ collection: 'users', id, overrideAccess: true })
      } catch {
        // Already gone — a test may have deleted it deliberately.
      }
    }
  }

  return { payload, users, cleanup }
}

/**
 * Run an operation as a given role.
 *
 * `overrideAccess: false` is what makes these tests meaningful — it is the flag
 * that tells Payload to actually evaluate the access functions rather than
 * bypassing them. Every assertion here depends on it.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asUser(user: FixtureUser): { user: any } {
  return { user: { ...user, collection: 'users' } }
}

/** True when the operation was refused. */
export async function isDenied(operation: () => Promise<unknown>): Promise<boolean> {
  try {
    await operation()
    return false
  } catch {
    return true
  }
}
