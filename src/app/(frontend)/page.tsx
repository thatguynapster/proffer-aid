import type { Campaign, Update } from '../../payload-types'
import { FeaturedCampaign } from '../../components/home/FeaturedCampaign'
import { Hero } from '../../components/home/Hero'
import { ImpactStats } from '../../components/home/ImpactStats'
import { PillarBand } from '../../components/home/PillarBand'
import { StoriesRail } from '../../components/home/StoriesRail'
import { SupportBand } from '../../components/home/SupportBand'
import { UpdateStrip } from '../../components/home/UpdateStrip'
import { donationsEnabled, getCms, getSettings } from '../../lib/cms'

export const revalidate = 300

export default async function HomePage() {
  const settings = await getSettings()
  const showDonate = await donationsEnabled()

  let updates: Update[] = []
  try {
    const payload = await getCms()
    const result = await payload.find({
      collection: 'updates',
      where: { _status: { equals: 'published' } },
      sort: '-date',
      limit: 6,
      depth: 1,
    })
    updates = result.docs
  } catch {
    // Render the static shell rather than failing the page outright.
  }

  // featuredCampaign may be an id or an already-populated document depending on
  // query depth, so handle both rather than assuming.
  const featured =
    settings?.featuredCampaign && typeof settings.featuredCampaign === 'object'
      ? (settings.featuredCampaign as Campaign)
      : null

  return (
    <>
      <Hero tagline={settings?.tagline} showDonate={showDonate} />
      <UpdateStrip updates={updates} />
      <FeaturedCampaign campaign={featured} showDonate={showDonate} />
      <ImpactStats
        counters={settings?.impactCounters ?? []}
        intro="Proffer Aid works with local health services, volunteers and partner organisations to reach communities where basic care is deficient, inefficient or absent."
      />
      <PillarBand />
      <StoriesRail updates={updates} />
      <SupportBand showDonate={showDonate} impactFraming={settings?.impactFraming} />
    </>
  )
}
