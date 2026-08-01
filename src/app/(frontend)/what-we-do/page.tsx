import type { Metadata } from 'next'

import { PageHero } from '../../../components/layout/PageHero'
import { PillarBand } from '../../../components/home/PillarBand'
import { RichText } from '../../../components/RichText'
import { Button } from '../../../components/ui/button'
import { Container } from '../../../components/ui/container'
import { donationsEnabled } from '../../../lib/cms'
import { getPage, getPageOr404, pageMetadata } from '../../../lib/pages'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage('what-we-do'), 'What we do')
}

export default async function WhatWeDoPage() {
  const page = await getPageOr404('what-we-do')
  const showDonate = await donationsEnabled()

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="What we"
        accent="Do"
        subtitle="Bridging the gap between health care services and the people who cannot reach them."
      />

      <Container width="narrow" className="py-14 sm:py-20">
        <RichText data={page.body} />
      </Container>

      <PillarBand />

      <Container className="py-16 text-center sm:py-20">
        <p className="mx-auto max-w-xl text-base leading-relaxed text-navy-600/70">
          Our programmes run on volunteers, partner organisations and in-kind support — from
          medical equipment to the professional expertise of people who give their time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/get-involved">Get involved</Button>
          <Button href="/updates" variant="secondary">
            See our updates
          </Button>
          {showDonate ? (
            <Button href="/donate" variant="secondary">
              Donate
            </Button>
          ) : null}
        </div>
      </Container>
    </>
  )
}
