import crypto from 'crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { setupFixtures, type Fixtures } from './helpers'

/**
 * Drives the real route handler, not the functions behind it.
 *
 * The forms work taught this the hard way: unit checks on the validation
 * functions all passed while the feature was broken in the browser. An
 * unverified webhook is a public "mark this donation paid" button, so these
 * exercise the actual HTTP entry point.
 */

const SECRET = 'sk_test_fixture_secret_for_signature_checks'

function sign(body: string): string {
  return crypto.createHmac('sha512', SECRET).update(body, 'utf8').digest('hex')
}

function chargeEvent(reference: string, overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    event: 'charge.success',
    data: {
      reference,
      amount: 5000,
      currency: 'GHS',
      status: 'success',
      paid_at: new Date().toISOString(),
      customer: { email: 'donor@example.test', first_name: 'Ama' },
      metadata: {},
      ...overrides,
    },
  })
}

function post(body: string, signature: string | null) {
  return new Request('http://localhost:3000/webhooks/paystack', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(signature ? { 'x-paystack-signature': signature } : {}),
    },
    body,
  })
}

describe('paystack webhook', () => {
  let f: Fixtures
  let POST: (request: Request) => Promise<Response>
  const references: string[] = []

  beforeAll(async () => {
    process.env.PAYSTACK_SECRET_KEY = SECRET
    process.env.PAYSTACK_MODE = 'test'
    f = await setupFixtures()
    ;({ POST } = await import('../src/app/webhooks/paystack/route'))
  })

  afterAll(async () => {
    for (const reference of references) {
      const found = await f.payload.find({
        collection: 'donations',
        where: { reference: { equals: reference } },
        overrideAccess: true,
      })
      for (const doc of found.docs) {
        await f.payload.delete({ collection: 'donations', id: doc.id, overrideAccess: true })
      }
    }
    await f.cleanup()
  })

  describe('signature verification', () => {
    it('rejects a request with no signature', async () => {
      const body = chargeEvent(`test-nosig-${Date.now()}`)
      const response = await POST(post(body, null))
      expect(response.status).toBe(401)
    })

    it('rejects a wrong signature', async () => {
      const body = chargeEvent(`test-badsig-${Date.now()}`)
      const response = await POST(post(body, 'a'.repeat(128)))
      expect(response.status).toBe(401)
    })

    it('rejects a signature computed over different bytes', async () => {
      // Exactly what happens if the handler parses JSON and re-stringifies
      // before verifying — the classic way to break this.
      const body = chargeEvent(`test-tampered-${Date.now()}`)
      const signature = sign(body)
      const reordered = JSON.stringify(JSON.parse(body))
      const response = await POST(post(reordered + ' ', signature))
      expect(response.status).toBe(401)
    })

    it('does not record anything for an unsigned request', async () => {
      const reference = `test-unrecorded-${Date.now()}`
      references.push(reference)
      await POST(post(chargeEvent(reference), null))

      const found = await f.payload.find({
        collection: 'donations',
        where: { reference: { equals: reference } },
        overrideAccess: true,
      })
      expect(found.totalDocs).toBe(0)
    })

    it('accepts a correctly signed request', async () => {
      const reference = `test-valid-${Date.now()}`
      references.push(reference)
      const body = chargeEvent(reference)
      const response = await POST(post(body, sign(body)))

      expect(response.status).toBe(200)
      expect(await response.json()).toMatchObject({ received: true, action: 'created' })
    })
  })

  describe('recording', () => {
    it('stores the donation with the right amount and status', async () => {
      const reference = `test-stored-${Date.now()}`
      references.push(reference)
      const body = chargeEvent(reference, { amount: 12345 })
      await POST(post(body, sign(body)))

      const found = await f.payload.find({
        collection: 'donations',
        where: { reference: { equals: reference } },
        overrideAccess: true,
      })
      expect(found.totalDocs).toBe(1)
      expect(found.docs[0].amount).toBe(12345)
      expect(found.docs[0].status).toBe('success')
      expect(found.docs[0].source).toBe('paystack')
    })

    it('is idempotent — a redelivered event does not duplicate', async () => {
      const reference = `test-idempotent-${Date.now()}`
      references.push(reference)
      const body = chargeEvent(reference)
      const signature = sign(body)

      const first = await POST(post(body, signature))
      const second = await POST(post(body, signature))
      const third = await POST(post(body, signature))

      expect(await first.json()).toMatchObject({ action: 'created' })
      expect(await second.json()).toMatchObject({ action: 'unchanged' })
      expect(await third.json()).toMatchObject({ action: 'unchanged' })

      const found = await f.payload.find({
        collection: 'donations',
        where: { reference: { equals: reference } },
        overrideAccess: true,
      })
      expect(found.totalDocs).toBe(1)
    })

    it('ignores mode declared in the payload and uses our configuration', async () => {
      // A forged event must not be able to declare itself live and inflate a
      // public total.
      const reference = `test-mode-${Date.now()}`
      references.push(reference)
      const body = chargeEvent(reference, { mode: 'live', livemode: true })
      await POST(post(body, sign(body)))

      const found = await f.payload.find({
        collection: 'donations',
        where: { reference: { equals: reference } },
        overrideAccess: true,
      })
      expect(found.docs[0].mode).toBe('test')
    })

    it('acknowledges unhandled event types without recording', async () => {
      const reference = `test-unhandled-${Date.now()}`
      references.push(reference)
      const body = JSON.stringify({
        event: 'subscription.create',
        data: { reference, amount: 5000 },
      })
      const response = await POST(post(body, sign(body)))

      // 200 so Paystack stops retrying an event we will never act on.
      expect(response.status).toBe(200)
      expect(await response.json()).toMatchObject({ ignored: 'subscription.create' })

      const found = await f.payload.find({
        collection: 'donations',
        where: { reference: { equals: reference } },
        overrideAccess: true,
      })
      expect(found.totalDocs).toBe(0)
    })

    it('rejects malformed JSON that is correctly signed', async () => {
      const body = '{not valid json'
      const response = await POST(post(body, sign(body)))
      expect(response.status).toBe(400)
    })
  })

  describe('totals', () => {
    it('excludes test-mode donations from a campaign total', async () => {
      const { sumRaisedForCampaign } = await import('../src/lib/donations')

      // Reuse the seed's Lexical builders — an empty root fails validation.
      const { doc, p } = await import('../src/seed/lexical')

      const campaign = await f.payload.create({
        collection: 'campaigns',
        data: {
          title: 'Test campaign',
          slug: `test-campaign-${Date.now()}`,
          status: 'active',
          goalAmount: 100000,
          summary: 'Fixture',
          story: doc(p('Fixture campaign story.')),
        } as never,
        overrideAccess: true,
      })

      const reference = `test-total-${Date.now()}`
      references.push(reference)
      const body = chargeEvent(reference, { metadata: { campaignId: String(campaign.id) } })
      await POST(post(body, sign(body)))

      // The donation exists and is attributed, but PAYSTACK_MODE is test — so
      // it must not count toward a publicly displayed figure.
      const total = await sumRaisedForCampaign(f.payload, String(campaign.id))
      expect(total).toBe(0)

      await f.payload.delete({ collection: 'campaigns', id: campaign.id, overrideAccess: true })
    })
  })
})
