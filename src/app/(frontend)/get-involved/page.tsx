import type { Metadata } from 'next'
import Link from 'next/link'

import { EnquiryForm } from '../../../components/forms/EnquiryForm'
import { PageHero } from '../../../components/layout/PageHero'
import { RichText } from '../../../components/RichText'
import { Accordion } from '../../../components/ui/Accordion_bak'
import { Container, SectionHeading } from '../../../components/ui/container'
import { FORM_LABELS, FORM_TYPES, isFormType, type FormType } from '../../../lib/forms'
import { splitFaqBody } from '../../../lib/lexical'
import { getPage, getPageOr404, pageMetadata } from '../../../lib/pages'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage('get-involved'), 'Get involved')
}

export default async function GetInvolvedPage({
  searchParams,
}: {
  searchParams: Promise<{ form?: string }>
}) {
  const page = await getPageOr404('get-involved')
  const params = await searchParams
  const active: FormType = isFormType(params.form) ? params.form : 'volunteer'

  const { intro, faqs } = splitFaqBody(page.body)

  return (
    <>
      <PageHero
        eyebrow="Join us"
        title="Get"
        accent="Involved"
        subtitle="Volunteer on a project, become a member, or partner with us."
      />

      {intro ? (
        <Container width="narrow" className="pt-14 sm:pt-20">
          <RichText data={intro} />
        </Container>
      ) : null}

      <Container className="py-14 sm:py-20">
        {/*
          Form selection is a link, not client state, so each form has a real
          shareable URL and the page works without JavaScript. Same reasoning as
          the updates category filter.
        */}
        <nav aria-label="Choose an enquiry type" className="flex flex-wrap justify-center gap-2">
          {FORM_TYPES.map((type) => {
            const selected = type === active
            return (
              <Link
                key={type}
                href={`/get-involved?form=${type}`}
                aria-current={selected ? 'page' : undefined}
                scroll={false}
                className={`rounded-pill border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                  selected
                    ? 'border-navy-600 bg-navy-600 text-cream'
                    : 'border-navy-600/25 text-navy-600 hover:border-navy-600 hover:bg-navy-600/5'
                }`}
              >
                {FORM_LABELS[type].title}
              </Link>
            )
          })}
        </nav>

        <div className="mx-auto mt-10 max-w-xl rounded-card bg-paper p-7 shadow-[0_1px_2px_rgba(16,16,96,0.04),0_8px_24px_-12px_rgba(16,16,96,0.12)] sm:p-9">
          <h2 className="font-display text-2xl text-navy-600">{FORM_LABELS[active].title}</h2>
          <div className="mt-5">
            {/* Remounts on form change so React doesn't carry one form's
                values or errors into another. */}
            <EnquiryForm key={active} formType={active} />
          </div>
        </div>
      </Container>

      {faqs.length > 0 ? (
        <section aria-labelledby="faq" className="border-t border-navy-600/10 py-16 sm:py-20">
          <Container width="narrow">
            <SectionHeading as="h2" accent="Questions" size="sm">
              Common
            </SectionHeading>
            <div className="mt-10">
              <Accordion items={faqs} />
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
