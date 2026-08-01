import { notFound } from 'next/navigation'

import { Button } from '../../../../components/ui/button'
import { Container } from '../../../../components/ui/container'
import { donationsEnabled, getCms } from '../../../../lib/cms'
import { recordTransaction } from '../../../../lib/donations'
import { formatGhs, verifyTransaction } from '../../../../lib/paystack'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Thank you' }

/**
 * Where Paystack returns the donor after checkout.
 *
 * The reference in the query string is NOT trusted — anyone can visit this URL
 * with any reference. It is verified server-side against Paystack's API before
 * anything is shown or stored.
 *
 * Recording here as well as in the webhook is deliberate belt-and-braces:
 * either path alone is sufficient, and `recordTransaction` is idempotent, so
 * whichever arrives first wins and the second is a no-op. Without it, a webhook
 * that fails to deliver would silently lose the donation.
 */
export default async function DonateCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>
}) {
  if (!(await donationsEnabled())) notFound()

  const params = await searchParams
  const reference = params.reference || params.trxref

  let verified = null
  if (reference) {
    verified = await verifyTransaction(reference)
    if (verified?.status === 'success') {
      try {
        const payload = await getCms()
        await recordTransaction(payload, verified)
      } catch (error) {
        // The donor's confirmation must not depend on our storage. Paystack has
        // their money either way, and the webhook will retry.
        console.error('Failed to record donation from callback', error)
      }
    }
  }

  // Narrow rather than assert, so the amount below is provably non-null.
  const confirmed = verified?.status === 'success' ? verified : null
  const success = confirmed !== null

  return (
    <Container width="narrow" className="py-24 text-center sm:py-32">
      {success ? (
        <>
          <p className="font-display text-display-sm text-gold-500">Thank you</p>
          <h1 className="mt-4 font-display text-display-sm text-navy-600 sm:text-display-md">
            Your donation is received
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-navy-600/70">
            We&rsquo;ve received {formatGhs(confirmed.amountPesewas)}. Paystack will email your
            receipt. Thank you for supporting our work.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-display-sm text-navy-600 sm:text-display-md">
            We couldn&rsquo;t confirm that payment
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-navy-600/70">
            {reference
              ? 'The payment may still be processing, or it may not have completed. Nothing has been taken twice — if you were charged, it will appear shortly and we will be in touch.'
              : 'No payment reference was provided.'}
          </p>
        </>
      )}

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button href="/">Back to home</Button>
        {!success ? (
          <Button href="/donate" variant="secondary">
            Try again
          </Button>
        ) : (
          <Button href="/updates" variant="secondary">
            See our work
          </Button>
        )}
      </div>
    </Container>
  )
}
