import type { CollectionConfig } from 'payload'

import { isAdmin, isAnyone, isEditorOrAbove } from '../access'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team member', plural: 'Team members' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
    group: 'Content',
  },
  access: {
    read: isAnyone,
    create: isEditorOrAbove,
    update: isEditorOrAbove,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional. Members without a photo fall back to a designed initials avatar, not a stock silhouette.',
      },
    },
    { name: 'bio', type: 'textarea' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'twitter', type: 'text' },
      ],
    },
  ],
}
