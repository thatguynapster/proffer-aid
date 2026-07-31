/**
 * Logo shown on the admin login screen.
 *
 * Plain `<img>` rather than `next/image`: these render inside Payload's own
 * layout, the asset is a fixed 9 KB file served from /public, and next/image
 * would add a layout wrapper for no benefit at this size.
 */
export function Logo() {
  return (
    <img
      src="/img/logo-long.png"
      alt="Proffer Aid International Foundation"
      width={220}
      height={64}
    />
  )
}
