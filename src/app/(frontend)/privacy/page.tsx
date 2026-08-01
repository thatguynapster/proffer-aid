import type { Metadata } from 'next'

import { PageHero } from '../../../components/layout/PageHero'
import { RichText } from '../../../components/RichText'
import { Container } from '../../../components/ui/container'
import { getPage, getPageOr404, pageMetadata } from '../../../lib/pages'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage('privacy'), 'Privacy policy')
}

/**
 * The privacy policy is seeded as an UNPUBLISHED draft on purpose: it makes
 * binding representations about how personal data is handled, and a generated
 * one would be worse than none. `getPageOr404` only returns published pages, so
 * this route 404s until someone writes and publishes it.
 *
 * The route exists so that 404 is a deliberate "not published yet" rather than
 * a missing route — and so publishing it in the CMS makes it live with no
 * deploy. The footer links here regardless; a 404 on a policy link is a visible
 * prompt to finish it, where a silently missing link is not.
 */
export default async function PrivacyPage() {
  const page = await getPageOr404('privacy')

  return (
    <>
      <PageHero title="Privacy" accent="Policy" />
      <Container width="narrow" className="py-14 sm:py-20">
        <RichText data={page.body} />
      </Container>
    </>
  )
}
