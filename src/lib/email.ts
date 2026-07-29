import type { Payload } from 'payload'

const FORM_LABELS: Record<string, string> = {
  volunteer: 'Volunteer application',
  membership: 'Membership application',
  partnership: 'Partnership inquiry',
}

/**
 * Resolve the notification recipient.
 *
 * The address lives in SiteSettings rather than an env var because PAIF expect
 * it to change (PRD §6) — changing where enquiries land should be a content
 * edit, not a redeploy. The env var is only a fallback for a fresh database.
 */
async function resolveRecipient(payload: Payload): Promise<string | null> {
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const configured = (settings as { notificationEmail?: string })?.notificationEmail
    if (configured) return configured
  } catch {
    // Global may not exist yet on a fresh install — fall through.
  }
  return process.env.EMAIL_FALLBACK_RECIPIENT ?? null
}

export async function sendSubmissionNotification(
  payload: Payload,
  doc: Record<string, unknown>,
): Promise<void> {
  const to = await resolveRecipient(payload)
  if (!to) {
    payload.logger.warn('No notification recipient configured; skipping submission email.')
    return
  }

  const formType = String(doc.formType ?? '')
  const label = FORM_LABELS[formType] ?? 'Form submission'

  const rows = (
    [
      ['Name', doc.name],
      ['Email', doc.email],
      ['Phone', doc.phone],
      ['Organization', doc.organization],
      ['Occupation', doc.occupation],
      ['Availability', doc.availability],
      ['Area of interest', doc.areaOfInterest],
      ['Partnership type', doc.partnershipType],
      ['Message', doc.message],
    ] as const
  ).filter(([, value]) => value !== undefined && value !== null && value !== '')

  const text = [
    `New ${label.toLowerCase()} from profferaid.com`,
    '',
    ...rows.map(([labelText, value]) => `${labelText}: ${String(value)}`),
    '',
    'View and export submissions in the admin panel under Administration → Form submissions.',
  ].join('\n')

  const html = [
    `<h2>New ${label.toLowerCase()}</h2>`,
    '<table cellpadding="6" style="border-collapse:collapse">',
    ...rows.map(
      ([labelText, value]) =>
        `<tr><td style="border:1px solid #ddd"><strong>${labelText}</strong></td><td style="border:1px solid #ddd">${escapeHtml(String(value))}</td></tr>`,
    ),
    '</table>',
  ].join('')

  await payload.sendEmail({ to, subject: `${label} — ${String(doc.name ?? 'Unknown')}`, text, html })
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
