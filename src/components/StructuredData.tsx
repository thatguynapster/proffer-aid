import { SITE_URL as BASE } from '../lib/site-url'
import type { SiteSetting } from '../payload-types'

/**
 * Organisation structured data (schema.org NGO).
 *
 * Built from SiteSettings so it stays accurate as PAIF edit their own details,
 * rather than drifting from a hardcoded copy.
 *
 * Deliberately does NOT assert a single registered legal entity or a founding
 * date. PRD §2.2 records that which entity is the registered donee — the
 * Italian headquarters or the Ghanaian branch — is still unconfirmed, and the
 * "established ~2010" figure is unverified. Both offices are published as
 * `location`, which is factual; claiming a registration or founding date we
 * cannot evidence would be worse than omitting it.
 */
export function StructuredData({ settings }: { settings: SiteSetting | null }) {
  const name = settings?.orgName ?? 'Proffer Aid International Foundation'

  const sameAs = Object.values(settings?.social ?? {}).filter(
    (url): url is string => typeof url === 'string' && url.startsWith('http'),
  )

  const locations = (settings?.offices ?? []).map((office) => ({
    '@type': 'Place',
    name: office.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.addressLines?.replace(/\n/g, ', '),
      // Inferred from the address text itself rather than a separate field —
      // omitted entirely when it can't be determined, rather than guessed.
      ...(office.addressLines?.includes('Italy')
        ? { addressCountry: 'IT' }
        : office.addressLines?.includes('Ghana')
          ? { addressCountry: 'GH' }
          : {}),
    },
    ...(office.phone ? { telephone: office.phone } : {}),
  }))

  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name,
    url: BASE,
    logo: `${BASE}/img/logo-square.png`,
    image: `${BASE}/img/logo-square.png`,
    ...(settings?.tagline ? { slogan: settings.tagline } : {}),
    ...(settings?.mission ? { description: settings.mission } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(locations.length > 0 ? { location: locations } : {}),
    ...(settings?.notificationEmail ? { email: settings.notificationEmail } : {}),
    knowsAbout: [
      'Community health',
      'Mobile medical outreach',
      'Health education',
      'Cancer screening',
    ],
    areaServed: { '@type': 'Place', name: 'Sub-Saharan Africa' },
  }

  return (
    <script
      type="application/ld+json"
      // Serialised via JSON.stringify, so no user content can break out of the
      // script tag; `<` is additionally escaped in case a field ever contains
      // markup.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
