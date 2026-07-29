import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAbove, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrAuthenticated,
    create: isEditorOrAbove,
    update: isEditorOrAbove,
    // Deleting a page breaks navigation and inbound links, so it stays with
    // Admin. Editors unpublish instead.
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'subtitle',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'Overrides the defaults. Leave blank to derive from the title and hero.',
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
