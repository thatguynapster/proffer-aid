import type { Metadata } from 'next'

import { PageHero } from '../../../components/layout/PageHero'
import { RichText } from '../../../components/RichText'
import { TeamGrid } from '../../../components/about/TeamGrid'
import { Container } from '../../../components/ui/Container'
import { getCms, getSettings } from '../../../lib/cms'
import { getPage, getPageOr404, pageMetadata } from '../../../lib/pages'
import type { TeamMember } from '../../../payload-types'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage('about'), 'About us')
}

export default async function AboutPage() {
  const page = await getPageOr404('about')
  const settings = await getSettings()

  let team: TeamMember[] = []
  try {
    const payload = await getCms()
    const result = await payload.find({
      collection: 'team-members',
      sort: 'order',
      limit: 50,
      depth: 1,
    })
    team = result.docs
  } catch {
    // Team is supplementary — the page still stands without it.
  }

  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="About"
        accent="Proffer Aid"
        subtitle={settings?.vision}
      />

      <Container width="narrow" className="py-14 sm:py-20">
        <RichText data={page.body} />
      </Container>

      <TeamGrid members={team} />
    </>
  )
}
