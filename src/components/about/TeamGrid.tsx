import Image from 'next/image'

import type { TeamMember } from '../../payload-types'
import { mediaAlt, mediaUrl } from '../../lib/cms'
import { Container, SectionHeading } from '../ui/container'

/**
 * Members without a photograph get a designed initials avatar rather than a
 * generic silhouette. Two of PAIF's six have no recovered image, and a plate of
 * grey placeholder people reads as neglect; initials in the brand palette read
 * as intentional.
 */
function initials(name: string): string {
  return name
    .replace(/^(Dr|Rev|Mr|Mrs|Ms|Prof)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null

  return (
    <section aria-labelledby="team" className="border-t border-navy-600/10 py-16 sm:py-24">
      <Container>
        <SectionHeading as="h2" accent="Team">
          Our
        </SectionHeading>
        <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-navy-600/70">
          Medical professionals, community leaders and volunteers across Europe and Ghana.
        </p>

        <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => {
            const photo = mediaUrl(member.photo, 'card')
            return (
              <li key={member.id}>
                <div className="relative aspect-4/5 overflow-hidden rounded-card bg-navy-600/8">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={mediaAlt(member.photo) || member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center bg-navy-600"
                    >
                      <span className="font-display text-6xl text-gold-500">
                        {initials(member.name)}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="mt-4 text-base font-semibold text-navy-600">{member.name}</h3>
                <p className="mt-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ochre">
                  {member.role}
                </p>
                {member.bio ? (
                  <p className="mt-3 text-sm leading-relaxed text-navy-600/70">{member.bio}</p>
                ) : null}
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
