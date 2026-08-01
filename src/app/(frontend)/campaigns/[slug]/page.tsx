import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BudgetTable } from '../../../../components/campaigns/BudgetTable'
import { ProgressBar } from '../../../../components/campaigns/ProgressBar'
import { PhotoSlot } from '../../../../components/media/PhotoSlot'
import { RichText } from '../../../../components/RichText'
import { Button } from '../../../../components/ui/button'
import { Container } from '../../../../components/ui/container'
import { getCampaign } from '../../../../lib/campaigns'
import { donationsEnabled, getCms, mediaAlt, mediaUrl } from '../../../../lib/cms'

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const payload = await getCms()
    const { docs } = await payload.find({
      collection: 'campaigns',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 0,
      select: { slug: true },
    })
    return docs.filter((d) => d.slug).map((d) => ({ slug: String(d.slug) }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const campaign = await getCampaign(slug)
  if (!campaign) return { title: 'Campaign not found' }

  const image = mediaUrl(campaign.heroImage, 'hero')
  return {
    title: campaign.title,
    description: campaign.summary ?? undefined,
    openGraph: {
      title: campaign.title,
      description: campaign.summary ?? undefined,
      type: 'article',
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [campaign, showDonate] = await Promise.all([getCampaign(slug), donationsEnabled()])
  if (!campaign) notFound()

  const gallery = (campaign.gallery ?? []).filter((entry) => entry.image)
  const complete = campaign.status === 'completed'

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-navy-600/60 hover:text-ochre"
        >
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All campaigns
        </Link>
      </Container>

      <Container width="narrow" className="pt-8 pb-10 sm:pt-10">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
          {complete ? 'Completed campaign' : 'Active campaign'}
        </p>
        <h1 className="mt-4 font-display text-display-sm sm:text-display-md text-balance text-navy-600">
          {campaign.title}
        </h1>
        {campaign.summary ? (
          <p className="mt-5 text-lg leading-relaxed text-navy-600/70">{campaign.summary}</p>
        ) : null}
      </Container>

      <Container>
        <PhotoSlot
          src={mediaUrl(campaign.heroImage, 'hero')}
          alt={mediaAlt(campaign.heroImage)}
          need={`Hero image — ${campaign.title}`}
          spec="1600×900"
          sizes="(max-width: 1024px) 100vw, 1152px"
          priority
          className="aspect-video w-full rounded-card"
        />
      </Container>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <RichText data={campaign.story} />
            <BudgetTable items={campaign.budgetBreakdown ?? []} />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-card bg-paper p-7 shadow-[0_1px_2px_rgba(16,16,96,0.04),0_8px_24px_-12px_rgba(16,16,96,0.12)]">
              <ProgressBar campaign={campaign} showTotals={showDonate} />

              {showDonate && !complete ? (
                <Button
                  href={`/donate?campaign=${campaign.id}`}
                  className="mt-6 w-full"
                >
                  Donate to this campaign
                </Button>
              ) : null}

              {/* With donations off there is no progress bar and no donate
                  button, so the panel would otherwise be empty. Point people at
                  the ways they *can* help. */}
              {!showDonate ? (
                <>
                  <h2 className="font-display text-xl text-navy-600">Support this work</h2>
                  <p className="mt-3 text-sm leading-relaxed text-navy-600/70">
                    Online donations are not open yet. You can still help through volunteering,
                    partnership, or in-kind donations of equipment and supplies.
                  </p>
                  <Button href="/get-involved" className="mt-6 w-full">
                    Get involved
                  </Button>
                  <Button href="/contact" variant="secondary" className="mt-3 w-full">
                    Contact us
                  </Button>
                </>
              ) : null}

              {complete && showDonate ? (
                <p className="mt-5 text-sm leading-relaxed text-navy-600/70">
                  This campaign has closed. Thank you to everyone who gave.
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>

      {gallery.length > 0 ? (
        <Container className="pb-16 sm:pb-24">
          <h2 className="sr-only">Gallery</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((entry, index) => (
              <li key={entry.id ?? index}>
                <PhotoSlot
                  src={mediaUrl(entry.image, 'card')}
                  alt={mediaAlt(entry.image)}
                  need="Campaign photograph"
                  spec="1200×900"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="aspect-4/3 w-full rounded-card"
                />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </>
  )
}
