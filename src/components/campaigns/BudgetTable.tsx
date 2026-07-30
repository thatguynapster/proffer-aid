import type { Campaign } from '../../payload-types'
import { formatGhs } from '../../lib/paystack'

/**
 * Budget breakdown.
 *
 * The total is summed from the line items rather than authored separately —
 * two numbers that must agree is one number too many, and a stated total that
 * disagrees with its own rows undermines exactly the transparency a budget
 * breakdown exists to provide.
 */
export function BudgetTable({ items }: { items: NonNullable<Campaign['budgetBreakdown']> }) {
  if (!items || items.length === 0) return null

  const total = items.reduce((sum, item) => sum + (item.amount ?? 0), 0)

  return (
    <section aria-labelledby="budget" className="mt-12">
      <h2 id="budget" className="font-display text-2xl text-navy-600">
        Where the money goes
      </h2>

      {/* Scrolls within itself rather than forcing the page sideways. */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-600/15 text-left">
              <th scope="col" className="pb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-navy-600/55">
                Item
              </th>
              <th scope="col" className="pb-3 text-right text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-navy-600/55">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id ?? index} className="border-b border-navy-600/8">
                <td className="py-4 pr-6 align-top text-navy-600">
                  {item.item}
                  {item.note ? (
                    <span className="mt-1 block text-xs text-navy-600/55">{item.note}</span>
                  ) : null}
                </td>
                <td className="py-4 text-right align-top font-semibold tabular-nums text-navy-600 whitespace-nowrap">
                  {formatGhs((item.amount ?? 0) * 100)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="pt-4 text-left font-semibold text-navy-600">
                Total
              </th>
              <td className="pt-4 text-right font-display text-xl tabular-nums text-navy-600 whitespace-nowrap">
                {formatGhs(total * 100)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
