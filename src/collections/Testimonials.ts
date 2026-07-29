import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAbove, publishedOrAuthenticated } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'attribution',
    defaultColumns: ['attribution', 'role', '_status'],
    group: 'Content',
    description:
      'Ships empty. Publish only real, attributable quotes — an empty section is honest, an invented testimonial is not (PRD §10).',
  },
  versions: { drafts: true },
  access: {
    read: publishedOrAuthenticated,
    create: isEditorOrAbove,
    update: isEditorOrAbove,
    delete: isAdmin,
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text', required: true },
    { name: 'role', type: 'text', admin: { description: 'e.g. "Volunteer nurse, Blue Mission"' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}
