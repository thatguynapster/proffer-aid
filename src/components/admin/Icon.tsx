/**
 * Icon shown in the admin sidebar header, beside the panel title.
 *
 * Rendered small (~28px), so the square mark is used rather than the wordmark —
 * `logo-long.png` is illegible at this size.
 */
export function Icon() {
  return (
    <img
      src="/img/logo-square.png"
      alt=""
      width={28}
      height={28}
      style={{ borderRadius: 'var(--style-radius-s)' }}
    />
  )
}
