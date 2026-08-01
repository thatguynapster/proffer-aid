import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '../../../../components/RichText'
import { UpdateCard } from '../../../../components/updates/UpdateCard'
import { Button } from '../../../../components/ui/button'
import { Container, SectionHeading } from '../../../../components/ui/container'
import { PhotoSlot } from '../../../../components/media/PhotoSlot'
import { getCms, mediaAlt, mediaUrl } from '../../../../lib/cms'
import {
  categoryLabel,
  externalHref,
  formatUpdateDate,
  getRelatedUpdates,
  getUpdate,
} from '../../../../lib/updates'

export const revalidate = 300

/** Pre-render published updates; anything created later is rendered on demand
 *  and then cached, so PAIF publishing a post needs no deploy. */
export async function generateStaticParams() {
  try {
    const payload = await getCms()
    const { docs } = await payload.find({
      collection: 'updates',
      where: { _status: { equals: 'published' } },
      limit: 200,
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
  const update = await getUpdate(slug)
  if (!update) return { title: 'Update not found' }

  const image = mediaUrl(update.coverImage, 'hero')

  return {
    title: update.title,
    description: update.excerpt ?? undefined,
    openGraph: {
      title: update.title,
      description: update.excerpt ?? undefined,
      type: 'article',
      publishedTime: update.date ?? undefined,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const update = await getUpdate(slug)
  if (!update) notFound()

  const cover = mediaUrl(update.coverImage, 'hero')
  const date = formatUpdateDate(update.date)
  const external = externalHref(update)
  const related = await getRelatedUpdates(update)

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <Link
          href="/updates"
          className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-navy-600/60 hover:text-ochre"
        >
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All updates
        </Link>
      </Container>

      <article>
        <Container width="narrow" className="pt-8 pb-10 sm:pt-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
              {categoryLabel(update.category)}
            </p>
            {date ? (
              <time dateTime={update.date ?? undefined} className="text-xs text-navy-600/50">
                {date}
              </time>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-display-sm sm:text-display-md text-balance text-navy-600">
            {update.title}
          </h1>

          {update.excerpt ? (
            <p className="mt-5 text-lg leading-relaxed text-navy-600/70">{update.excerpt}</p>
          ) : null}
        </Container>

        <Container>
          <PhotoSlot
            src={cover}
            alt={mediaAlt(update.coverImage)}
            need={`Lead image — ${update.title}`}
            spec="1600×900"
            sizes="(max-width: 1024px) 100vw, 1152px"
            priority
            className="aspect-16/9 w-full rounded-card"
          />
        </Container>

        <Container width="narrow" className="py-12 sm:py-16">
          {/* Coverage hosted elsewhere: credit the publisher up front rather
              than burying the fact that the full piece lives off-site. */}
          {external ? (
            <div className="mb-10 rounded-card border border-gold-500 bg-gold-500/8 p-6">
              <p className="text-sm text-navy-600">
                This piece was published by{' '}
                <strong className="font-semibold">
                  {update.externalSource?.publication || 'an external source'}
                </strong>
                .
              </p>
              <Button href={external} variant="secondary" size="md" className="mt-4">
                Read the full piece
              </Button>
            </div>
          ) : null}

          <RichText data={update.body} />
        </Container>
      </article>

      {related.length > 0 ? (
        <section aria-labelledby="related" className="border-t border-navy-600/10 py-16 sm:py-20">
          <Container>
            <SectionHeading as="h2" accent="Updates" size="sm">
              More
            </SectionHeading>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <UpdateCard key={item.id} update={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
