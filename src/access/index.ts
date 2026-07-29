import type { Access, FieldAccess } from 'payload'

/**
 * Roles, most privileged first. See PRD §2.4.
 *
 * admin        — Napster only. Full access including schema and SiteSettings.
 * leadEditor   — Named PAIF organiser. Everything Editor can do, plus user
 *                management (below Admin) and recording offline donations.
 * editor       — Publishes Updates, creates/edits Campaigns, Pages, TeamMembers.
 * contributor  — Drafts Updates. Cannot publish.
 * viewer       — Read-only. Not assigned at launch.
 */
export const ROLES = ['admin', 'leadEditor', 'editor', 'contributor', 'viewer'] as const

export type Role = (typeof ROLES)[number]

/** Roles a Lead Editor is allowed to assign. Deliberately excludes admin and
 *  leadEditor — preventing that escalation is the single most important access
 *  rule in the system (PRD §11(a)). */
export const LEAD_EDITOR_ASSIGNABLE_ROLES: Role[] = ['editor', 'contributor', 'viewer']

type MaybeUser = { role?: Role | null; active?: boolean | null } | null | undefined

/**
 * A user is only ever considered to hold a role if their account is active.
 * `active` defaults to true, so a user document that predates the field (or
 * omits it) is not accidentally locked out — but an explicit `false` always
 * denies. See PRD §11(e).
 */
const holds = (user: MaybeUser, roles: Role[]): boolean => {
  if (!user || user.active === false) return false
  return !!user.role && roles.includes(user.role)
}

export const hasRole = (user: MaybeUser, ...roles: Role[]): boolean => holds(user, roles)

// --- Collection-level access -----------------------------------------------

export const isAdmin: Access = ({ req: { user } }) => holds(user as MaybeUser, ['admin'])

export const isAdminOrLeadEditor: Access = ({ req: { user } }) =>
  holds(user as MaybeUser, ['admin', 'leadEditor'])

export const isEditorOrAbove: Access = ({ req: { user } }) =>
  holds(user as MaybeUser, ['admin', 'leadEditor', 'editor'])

export const isContributorOrAbove: Access = ({ req: { user } }) =>
  holds(user as MaybeUser, ['admin', 'leadEditor', 'editor', 'contributor'])

/** Any active, authenticated user — including Viewer. */
export const isAuthenticated: Access = ({ req: { user } }) =>
  holds(user as MaybeUser, [...ROLES])

export const isAnyone: Access = () => true

export const isNobody: Access = () => false

/**
 * Public read for published content, full read for the content team.
 * Anonymous visitors never see drafts.
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (holds(user as MaybeUser, [...ROLES])) return true
  return { _status: { equals: 'published' } }
}

// --- Field-level access ----------------------------------------------------

export const isAdminField: FieldAccess = ({ req: { user } }) => holds(user as MaybeUser, ['admin'])

export const isAdminOrLeadEditorField: FieldAccess = ({ req: { user } }) =>
  holds(user as MaybeUser, ['admin', 'leadEditor'])
