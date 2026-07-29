import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

/**
 * Scaffold landing page. Confirms the Payload <-> Next <-> Mongo wiring is
 * live. Replaced by the real home page in Week 2 (PRD §10).
 */
export default async function HomePage() {
  let dbStatus: 'connected' | 'unavailable' = 'unavailable'
  let collectionCount = 0

  try {
    const payload = await getPayload({ config })
    collectionCount = Object.keys(payload.collections).length
    dbStatus = 'connected'
  } catch {
    // Expected until DATABASE_URI points at a reachable cluster.
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium tracking-wide text-brand-600 uppercase">Scaffold</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Proffer Aid International Foundation
        </h1>
        <p className="mt-3 text-slate-600">
          Next.js + Payload CMS scaffold is running. The public site is built in Week 2.
        </p>
      </div>

      <dl className="grid gap-3 rounded-lg border border-slate-200 p-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Database</dt>
          <dd className={dbStatus === 'connected' ? 'text-brand-700' : 'text-amber-700'}>
            {dbStatus === 'connected' ? 'Connected' : 'Not reachable — check DATABASE_URI'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Collections registered</dt>
          <dd className="text-slate-900">{collectionCount || '—'}</dd>
        </div>
      </dl>

      <a
        href="/admin"
        className="inline-flex w-fit rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Open the admin panel
      </a>
    </main>
  )
}
