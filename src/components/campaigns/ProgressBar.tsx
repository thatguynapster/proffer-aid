import type { Campaign } from '../../payload-types'
import { goalPesewas, progressPercent, raisedPesewas } from '../../lib/campaigns'
import { formatGhs } from '../../lib/paystack'

/**
 * Campaign progress.
 *
 * The raised figure is DERIVED from donation records — there is no editable
 * total anywhere in the system, by design (PRD §8). If this number is wrong,
 * the donation records are wrong; it cannot silently drift on its own.
 *
 * Hidden entirely when donations are switched off: a fundraising thermometer
 * with no way to give is worse than no thermometer, and while the Ghanaian
 * entity is still being set up there is no way to give.
 */
export function ProgressBar({
  campaign,
  showTotals,
}: {
  campaign: Campaign
  showTotals: boolean
}) {
  if (!showTotals) return null

  const goal = goalPesewas(campaign)
  if (goal <= 0) return null

  const raised = raisedPesewas(campaign)
  const percent = progressPercent(campaign)
  const complete = campaign.status === 'completed' || percent >= 100

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="font-display text-display-sm text-navy-600">
          {formatGhs(raised)}
          <span className="ml-2 text-base font-normal text-navy-600/55">
            of {formatGhs(goal)}
          </span>
        </p>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
          {complete ? 'Goal reached' : `${percent}% funded`}
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${formatGhs(raised)} raised of a ${formatGhs(goal)} goal`}
        className="mt-3 h-3 w-full overflow-hidden rounded-pill bg-navy-600/10"
      >
        <div
          className={`h-full rounded-pill transition-[width] duration-700 ease-out ${
            complete ? 'bg-navy-600' : 'bg-gold-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {raised === 0 ? (
        <p className="mt-3 text-xs text-navy-600/55">
          Be the first to donate to this campaign.
        </p>
      ) : null}
    </div>
  )
}
