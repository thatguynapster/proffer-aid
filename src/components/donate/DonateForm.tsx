'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { startDonation } from '../../app/(frontend)/donate/actions'
import { initialDonateState } from '../../lib/donate-state'
import { AMOUNT_TIERS_PESEWAS, calculateFeePesewas, formatGhs } from '../../lib/paystack'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-pill bg-gold-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-navy-600 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Redirecting…' : label}
    </button>
  )
}

/**
 * No one-time/monthly toggle: recurring donations are deferred to v2 (PRD §14),
 * and a toggle with one working option is worse than no toggle.
 */
export function DonateForm({
  campaignId,
  campaignTitle,
  feePercent,
  feeCapPesewas,
}: {
  campaignId?: string
  campaignTitle?: string
  feePercent: number
  feeCapPesewas: number
}) {
  const [state, formAction] = useActionState(startDonation, initialDonateState)
  const [selected, setSelected] = useState<number | null>(AMOUNT_TIERS_PESEWAS[1])
  const [custom, setCustom] = useState('')
  const [coverFee, setCoverFee] = useState(false)

  const customPesewas = Number(custom) > 0 ? Math.round(Number(custom) * 100) : 0
  const amount = selected ?? customPesewas
  const fee = amount > 0 ? calculateFeePesewas(amount, feePercent, feeCapPesewas) : 0
  const total = amount + (coverFee ? fee : 0)

  return (
    <form action={formAction} className="space-y-6">
      {campaignId ? <input type="hidden" name="campaignId" value={campaignId} /> : null}
      {/* The chosen tier travels as a hidden field so the amount is a real form
          value rather than something reconstructed from component state. */}
      <input type="hidden" name="amount" value={selected ?? ''} />

      {campaignTitle ? (
        <p className="rounded-2xl bg-navy-600/5 px-4 py-3 text-sm text-navy-600">
          Supporting <strong className="font-semibold">{campaignTitle}</strong>
        </p>
      ) : null}

      {state.status === 'error' && state.message ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </div>
      ) : null}

      <fieldset>
        <legend className="text-sm font-semibold text-navy-600">Choose an amount</legend>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {AMOUNT_TIERS_PESEWAS.map((tier) => {
            const active = selected === tier
            return (
              <button
                key={tier}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelected(tier)
                  setCustom('')
                }}
                className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-navy-600 bg-navy-600 text-cream'
                    : 'border-navy-600/20 text-navy-600 hover:border-navy-600'
                }`}
              >
                {formatGhs(tier)}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="customAmount" className="block text-sm font-semibold text-navy-600">
          Or enter another amount
        </label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-navy-600/50">
            GHS
          </span>
          <input
            id="customAmount"
            name="customAmount"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value)
              if (e.target.value) setSelected(null)
            }}
            className="w-full rounded-2xl border border-navy-600/20 bg-paper py-3 pr-4 pl-14 text-sm text-navy-600 focus:ring-2 focus:ring-navy-600/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-navy-600/10 pt-6">
        <div>
          <label htmlFor="donorName" className="block text-sm font-semibold text-navy-600">
            Your name <span className="text-xs font-normal text-navy-600/50">(optional)</span>
          </label>
          <input
            id="donorName"
            name="donorName"
            type="text"
            autoComplete="name"
            maxLength={120}
            className="mt-2 w-full rounded-2xl border border-navy-600/20 bg-paper px-4 py-3 text-sm text-navy-600 focus:ring-2 focus:ring-navy-600/30 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-navy-600">
            Email address
          </label>
          <p className="mt-1 text-xs text-navy-600/55">So Paystack can send you a receipt.</p>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            className="mt-2 w-full rounded-2xl border border-navy-600/20 bg-paper px-4 py-3 text-sm text-navy-600 focus:ring-2 focus:ring-navy-600/30 focus:outline-none"
          />
        </div>
      </div>

      {amount > 0 ? (
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-navy-600/5 p-4">
          <input
            name="coverFee"
            type="checkbox"
            checked={coverFee}
            onChange={(e) => setCoverFee(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-navy-600"
          />
          <span className="text-sm leading-relaxed text-navy-600/80">
            Add <strong className="font-semibold">{formatGhs(fee, { decimals: true })}</strong> to
            cover the transaction fee, so Proffer Aid receives the full{' '}
            {formatGhs(amount)}.
          </span>
        </label>
      ) : null}

      <SubmitButton label={total > 0 ? `Donate ${formatGhs(total)}` : 'Donate'} />

      <p className="text-center text-xs text-navy-600/55">
        You&rsquo;ll be taken to Paystack to complete your payment securely.
      </p>
    </form>
  )
}
