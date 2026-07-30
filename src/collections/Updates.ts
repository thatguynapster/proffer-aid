import type { CollectionConfig, Where } from 'payload'
import { APIError } from 'payload'

import { hasRole, isAdmin, isContributorOrAbove, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'

export const Updates: CollectionConfig = {
  slug: 'updates',
  labels: {
    singular: 'Update',
    plural: 'Updates',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrAuthenticated,
    create: isContributorOrAbove,
    update: ({ req: { user } }) => {
      if (hasRole(user, 'admin', 'leadEditor', 'editor')) return true
      // A Contributor may only edit their own drafts, and only while they are
      // still drafts (PRD §2.4 — Contributors cannot publish).
      if (hasRole(user, 'contributor')) {
        const own: Where = {
          and: [{ author: { equals: user!.id } }, { _status: { not_equals: 'published' } }],
        }
        return own
      }
      return false
    },
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Collection access returns a `where` clause, which constrains WHICH
        // documents a Contributor may touch — not WHICH VALUES they may write.
        // Their own draft satisfies that clause, so without this guard they can
        // set _status to published and publish it themselves, which is exactly
        // what the role is defined to prevent (PRD §2.4, §11b).
        //
        // Field-level access cannot cover this: _status is supplied by the
        // drafts feature rather than declared in `fields`.
        if (data?._status === 'published' && hasRole(req.user, 'contributor')) {
          throw new APIError(
            'Contributors cannot publish. Save as a draft and ask an Editor to review it.',
            403,
          )
        }
        void operation
        return data
      },
    ],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'outreach',
      options: [
        { label: 'Outreach', value: 'outreach' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Campaign', value: 'campaign' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
      hooks: {
        beforeChange: [
          ({ req, value, operation }) =>
            operation === 'create' && req.user ? req.user.id : value,
        ],
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Shown in listings and as the social share description.',
      },
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'externalSource',
      type: 'group',
      admin: {
        description:
          'For press coverage hosted elsewhere. If set, listings link out instead of to a detail page.',
      },
      fields: [
        { name: 'url', type: 'text' },
        { name: 'publication', type: 'text' },
      ],
    },
  ],
}
