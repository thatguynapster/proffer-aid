import { RichText } from '../RichText'

/**
 * Native `<details>`/`<summary>` rather than a JavaScript accordion.
 *
 * Works with JS disabled, gets keyboard handling and screen-reader semantics
 * from the platform for free, and browser find-in-page can open a closed
 * section to reveal a match — which a div-and-state implementation cannot do.
 */
export function Accordion({ items }: { items: { question: string; answer: unknown }[] }) {
  if (items.length === 0) return null

  return (
    <div className="divide-y divide-navy-600/12 border-y border-navy-600/12">
      {items.map((item, index) => (
        <details key={index} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-5 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="text-base font-semibold text-navy-600 group-open:text-ochre">
              {item.question}
            </h3>
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-navy-600/25 text-navy-600 transition-transform duration-200 group-open:rotate-45 group-open:border-ochre group-open:text-ochre"
            >
              <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v10M3 8h10" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <div className="pb-6">
            <RichText data={item.answer} className="max-w-2xl text-sm" />
          </div>
        </details>
      ))}
    </div>
  )
}
