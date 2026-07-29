import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAbove, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { sumRaisedForCampaign } from '../lib/donations'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'goalAmount', '_status'],
    group: 'Content',
    description:
      'Fundraising campaigns. Create one here and its page publishes automatically at /campaigns/<slug> — no developer needed.',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrAuthenticated,
    // Editors and above create campaigns themselves. This is what makes the
    // Amasaman page a content task rather than a development task (PRD §2.6).
    create: isEditorOrAbove,
    update: isEditorOrAbove,
    delete: isAdmin,
  },

  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (!doc?.id) return doc
        // Attached on read so the admin panel and the frontend see the same
        // derived figure, and so no code path can accidentally persist it.
        doc.raisedAmount = await sumRaisedForCampaign(req.payload, String(doc.id))
        return doc
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'goalAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Target in Ghana cedis (GHS). Whole cedis — no decimals.',
      },
    },
    {
      // Derived at read time by summing successful live donations. Declared
      // virtual so Payload never writes it to the database — there is
      // deliberately no way for anyone to type a raised amount by hand.
      name: 'raisedAmount',
      type: 'number',
      virtual: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calculated from donation records. Not editable by anyone, by design.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'One or two sentences, used in listings and social shares.' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'story',
      type: 'richText',
      required: true,
    },
    {
      name: 'budgetBreakdown',
      type: 'array',
      labels: { singular: 'Line item', plural: 'Budget line items' },
      admin: {
        description:
          'Structured so the breakdown renders as a consistent table regardless of who authors it.',
      },
      fields: [
        { name: 'item', type: 'text', required: true },
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
          admin: { description: 'Ghana cedis (GHS).' },
        },
        { name: 'note', type: 'text' },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}
