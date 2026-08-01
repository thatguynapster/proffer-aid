/**
 * Circular ↗ affordance used on story, update and campaign cards.
 *
 * Not a shadcn component — there is no equivalent — and not a button either: it
 * is a decorative span inside an already-clickable card, so it is
 * `aria-hidden` and carries no tab stop of its own. Making it focusable would
 * add a second stop to every card that goes to the same place.
 */
export function ArrowButton({ label, className = '' }: { label: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-9 shrink-0 items-center justify-center rounded-full border border-navy-600/25 transition-colors group-hover:border-navy-600 group-hover:bg-navy-600 group-hover:text-cream ${className}`}
      title={label}
    >
      <svg
        viewBox="0 0 16 16"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M4 12L12 4M12 4H6M12 4v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
