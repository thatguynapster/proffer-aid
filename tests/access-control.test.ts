import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { asUser, isDenied, setupFixtures, type Fixtures } from './helpers'

/**
 * PRD §11 makes access-control correctness a launch gate: "test that
 * Editor/Contributor roles can't exceed their intended permissions before
 * launch".
 *
 * These run against a real Payload instance and a real database. Mocking the
 * access layer would only prove the mock behaves — the whole point is to
 * exercise the same code path the admin panel and REST API use. Every call
 * passes `overrideAccess: false`, which is what makes Payload actually evaluate
 * the access functions.
 */
describe('access control', () => {
  let f: Fixtures
  const createdUpdates: string[] = []

  beforeAll(async () => {
    f = await setupFixtures()
  })

  afterAll(async () => {
    for (const id of createdUpdates) {
      try {
        await f.payload.delete({ collection: 'updates', id, overrideAccess: true })
      } catch {
        /* already removed */
      }
    }
    await f.cleanup()
  })

  describe('privilege escalation (§11a)', () => {
    it('Lead Editor cannot promote anyone to admin', async () => {
      const denied = await isDenied(() =>
        f.payload.update({
          collection: 'users',
          id: f.users.contributor.id,
          data: { role: 'admin' },
          overrideAccess: false,
          ...asUser(f.users.leadEditor),
        }),
      )
      expect(denied).toBe(true)
    })

    it('Lead Editor cannot promote anyone to leadEditor', async () => {
      const denied = await isDenied(() =>
        f.payload.update({
          collection: 'users',
          id: f.users.contributor.id,
          data: { role: 'leadEditor' },
          overrideAccess: false,
          ...asUser(f.users.leadEditor),
        }),
      )
      expect(denied).toBe(true)
    })

    it('Lead Editor cannot modify an Admin account', async () => {
      const denied = await isDenied(() =>
        f.payload.update({
          collection: 'users',
          id: f.users.admin.id,
          data: { name: 'Renamed by lead editor' },
          overrideAccess: false,
          ...asUser(f.users.leadEditor),
        }),
      )
      expect(denied).toBe(true)
    })

    it('Lead Editor CAN assign an allowed role', async () => {
      const result = await f.payload.update({
        collection: 'users',
        id: f.users.contributor.id,
        data: { role: 'editor' },
        overrideAccess: false,
        ...asUser(f.users.leadEditor),
      })
      expect((result as { role?: string }).role).toBe('editor')

      // Restore for later assertions.
      await f.payload.update({
        collection: 'users',
        id: f.users.contributor.id,
        data: { role: 'contributor' },
        overrideAccess: true,
      })
    })

    it('Contributor cannot change their own role', async () => {
      // Payload silently DROPS a field the user may not write rather than
      // throwing, so asserting on an exception here would be meaningless — the
      // call succeeds either way. Assert the security property instead: the
      // role must be unchanged afterwards.
      await f.payload
        .update({
          collection: 'users',
          id: f.users.contributor.id,
          data: { role: 'admin' },
          overrideAccess: false,
          ...asUser(f.users.contributor),
        })
        .catch(() => undefined)

      const after = await f.payload.findByID({
        collection: 'users',
        id: f.users.contributor.id,
        overrideAccess: true,
      })
      expect((after as { role?: string }).role).toBe('contributor')
    })
  })

  describe('publishing (§11b)', () => {
    it('Contributor can create a draft', async () => {
      const doc = await f.payload.create({
        collection: 'updates',
        data: {
          title: 'Test contributor draft',
          slug: `test-contributor-draft-${Date.now()}`,
          date: new Date().toISOString(),
          category: 'outreach',
          _status: 'draft',
        } as never,
        overrideAccess: false,
        ...asUser(f.users.contributor),
      })
      createdUpdates.push(String(doc.id))
      expect(doc.id).toBeDefined()
    })

    it('Contributor cannot publish their own draft', async () => {
      const id = createdUpdates[0]
      const denied = await isDenied(() =>
        f.payload.update({
          collection: 'updates',
          id,
          data: { _status: 'published' } as never,
          overrideAccess: false,
          ...asUser(f.users.contributor),
        }),
      )
      expect(denied).toBe(true)

      // And confirm the outcome, not just that it threw.
      const after = await f.payload.findByID({
        collection: 'updates',
        id,
        overrideAccess: true,
        draft: true,
      })
      expect((after as { _status?: string })._status).not.toBe('published')
    })

    it('Contributor cannot create an already-published update', async () => {
      // The obvious way around a publish guard that only covers updates.
      const denied = await isDenied(() =>
        f.payload.create({
          collection: 'updates',
          data: {
            title: 'Sneaky published',
            slug: `sneaky-published-${Date.now()}`,
            date: new Date().toISOString(),
            category: 'outreach',
            _status: 'published',
          } as never,
          overrideAccess: false,
          ...asUser(f.users.contributor),
        }),
      )
      expect(denied).toBe(true)
    })

    it("Contributor cannot edit another author's update", async () => {
      const other = await f.payload.create({
        collection: 'updates',
        data: {
          title: 'Editor owned',
          slug: `editor-owned-${Date.now()}`,
          date: new Date().toISOString(),
          category: 'outreach',
          _status: 'draft',
        } as never,
        overrideAccess: false,
        ...asUser(f.users.editor),
      })
      createdUpdates.push(String(other.id))

      const denied = await isDenied(() =>
        f.payload.update({
          collection: 'updates',
          id: String(other.id),
          data: { title: 'Hijacked' },
          overrideAccess: false,
          ...asUser(f.users.contributor),
        }),
      )
      expect(denied).toBe(true)
    })
  })

  describe('SiteSettings (§11c)', () => {
    it('Editor cannot write SiteSettings', async () => {
      const denied = await isDenied(() =>
        f.payload.updateGlobal({
          slug: 'site-settings',
          data: { tagline: 'Changed by editor' },
          overrideAccess: false,
          ...asUser(f.users.editor),
        }),
      )
      expect(denied).toBe(true)
    })

    it('Lead Editor cannot write SiteSettings either', async () => {
      const denied = await isDenied(() =>
        f.payload.updateGlobal({
          slug: 'site-settings',
          data: { tagline: 'Changed by lead editor' },
          overrideAccess: false,
          ...asUser(f.users.leadEditor),
        }),
      )
      expect(denied).toBe(true)
    })
  })

  describe('form submissions (§11d)', () => {
    it('cannot be created anonymously', async () => {
      const denied = await isDenied(() =>
        f.payload.create({
          collection: 'form-submissions',
          data: { formType: 'volunteer', name: 'Anon', email: 'a@b.co' } as never,
          overrideAccess: false,
        }),
      )
      expect(denied).toBe(true)
    })

    it('cannot be read anonymously', async () => {
      const denied = await isDenied(() =>
        f.payload.find({ collection: 'form-submissions', overrideAccess: false }),
      )
      expect(denied).toBe(true)
    })

    it('cannot be read by an Editor', async () => {
      const denied = await isDenied(() =>
        f.payload.find({
          collection: 'form-submissions',
          overrideAccess: false,
          ...asUser(f.users.editor),
        }),
      )
      expect(denied).toBe(true)
    })
  })

  describe('donations (§11f)', () => {
    it('cannot be read anonymously', async () => {
      const denied = await isDenied(() =>
        f.payload.find({ collection: 'donations', overrideAccess: false }),
      )
      expect(denied).toBe(true)
    })

    it('cannot be read by an Editor', async () => {
      const denied = await isDenied(() =>
        f.payload.find({
          collection: 'donations',
          overrideAccess: false,
          ...asUser(f.users.editor),
        }),
      )
      expect(denied).toBe(true)
    })

    it('cannot be read by a Viewer', async () => {
      const denied = await isDenied(() =>
        f.payload.find({
          collection: 'donations',
          overrideAccess: false,
          ...asUser(f.users.viewer),
        }),
      )
      expect(denied).toBe(true)
    })

    it('CAN be read by a Lead Editor', async () => {
      const result = await f.payload.find({
        collection: 'donations',
        overrideAccess: false,
        ...asUser(f.users.leadEditor),
      })
      expect(result).toBeDefined()
    })

    it('cannot be deleted by anyone, including Admin', async () => {
      // Deleting a donation silently changes a published fundraising total and
      // destroys the audit trail, so `delete` is isNobody by design.
      const donation = await f.payload.create({
        collection: 'donations',
        data: {
          reference: `test-${Date.now()}`,
          amount: 1000,
          currency: 'GHS',
          status: 'success',
          mode: 'test',
          source: 'offline',
        } as never,
        overrideAccess: true,
      })

      const denied = await isDenied(() =>
        f.payload.delete({
          collection: 'donations',
          id: String(donation.id),
          overrideAccess: false,
          ...asUser(f.users.admin),
        }),
      )
      expect(denied).toBe(true)

      await f.payload.delete({
        collection: 'donations',
        id: String(donation.id),
        overrideAccess: true,
      })
    })
  })

  describe('deactivated accounts (§11e)', () => {
    it('cannot authenticate', async () => {
      await f.payload.update({
        collection: 'users',
        id: f.users.viewer.id,
        data: { active: false },
        overrideAccess: true,
      })

      const denied = await isDenied(() =>
        f.payload.login({
          collection: 'users',
          data: { email: f.users.viewer.email, password: 'Test-Password-123!' },
        }),
      )
      expect(denied).toBe(true)
    })

    it('an active account CAN authenticate', async () => {
      const result = await f.payload.login({
        collection: 'users',
        data: { email: f.users.editor.email, password: 'Test-Password-123!' },
      })
      expect(result.user).toBeDefined()
    })
  })
})
