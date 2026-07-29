import type { CollectionConfig, Where } from 'payload'
import { APIError } from 'payload'

import {
  isAdmin,
  isAdminField,
  isAdminOrLeadEditorField,
  hasRole,
  LEAD_EDITOR_ASSIGNABLE_ROLES,
  ROLES,
  type Role,
} from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'active'],
    group: 'Administration',
  },
  access: {
    // Admin sees everyone. Lead Editor sees everyone (needed to manage them).
    // Everyone else sees only themselves.
    read: ({ req: { user } }) => {
      if (hasRole(user, 'admin', 'leadEditor')) return true
      if (user) return { id: { equals: user.id } }
      return false
    },

    create: ({ req: { user } }) => hasRole(user, 'admin', 'leadEditor'),

    update: ({ req: { user } }) => {
      if (hasRole(user, 'admin')) return true
      if (hasRole(user, 'leadEditor')) {
        // A Lead Editor may edit their own profile, or any account holding a
        // role they are permitted to assign. Admins and other Lead Editors are
        // out of reach entirely.
        const reachable: Where = {
          or: [{ id: { equals: user!.id } }, { role: { in: LEAD_EDITOR_ASSIGNABLE_ROLES } }],
        }
        return reachable
      }
      if (user) return { id: { equals: user.id } }
      return false
    },

    // Deletion is Admin-only. Lead Editors deactivate instead (PRD §2.4) —
    // deactivation preserves the audit trail that deletion would destroy.
    delete: isAdmin,
  },

  hooks: {
    // Deactivated accounts cannot authenticate. Payload has no built-in
    // concept of a disabled user, so this is the enforcement point (PRD §11e).
    beforeLogin: [
      ({ user }) => {
        if (user && (user as { active?: boolean }).active === false) {
          throw new APIError('This account has been deactivated.', 403)
        }
        return user
      },
    ],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'contributor',
      options: ROLES.map((role) => ({ label: roleLabel(role), value: role })),
      access: {
        // Only Admin and Lead Editor can write the field at all. This is what
        // stops a Contributor from editing their own profile to escalate.
        create: isAdminOrLeadEditorField,
        update: isAdminOrLeadEditorField,
      },
      validate: (value: unknown, { req }: { req?: { user?: unknown } }) => {
        const actor = req?.user
        // Field access already restricts writes to Admin and Lead Editor.
        // Admins may assign anything; Lead Editors may not reach for admin or
        // leadEditor. Field-level access can gate *whether* the field is
        // writable but not *what value* is written, so the check lives here.
        if (hasRole(actor as never, 'leadEditor')) {
          if (!LEAD_EDITOR_ASSIGNABLE_ROLES.includes(value as Role)) {
            return `A Lead Editor may only assign: ${LEAD_EDITOR_ASSIGNABLE_ROLES.join(', ')}.`
          }
        }
        return true
      },
      admin: {
        description:
          'Admin is reserved for the sole maintainer. Lead Editors may assign Editor, Contributor, or Viewer only.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      access: {
        create: isAdminOrLeadEditorField,
        update: isAdminOrLeadEditorField,
      },
      admin: {
        description: 'Uncheck to revoke access without deleting the account or its history.',
      },
    },
  ],
}

function roleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    admin: 'Admin',
    leadEditor: 'Lead Editor',
    editor: 'Editor',
    contributor: 'Contributor',
    viewer: 'Viewer',
  }
  return labels[role]
}
