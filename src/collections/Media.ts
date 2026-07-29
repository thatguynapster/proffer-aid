import type { CollectionConfig } from 'payload'

import { isAnyone, isContributorOrAbove, isEditorOrAbove } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
  },
  access: {
    read: isAnyone,
    create: isContributorOrAbove,
    update: isEditorOrAbove,
    delete: isEditorOrAbove,
  },
  upload: {
    // Files live in S3, never on the Vercel filesystem (PRD §9). The storage
    // adapter in payload.config.ts takes over from here.
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
    ],
    // Ghana-bound traffic is mobile and bandwidth-constrained (PRD §11), so
    // serve WebP rather than the original JPEG/PNG wherever possible.
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for screen readers. Required — WCAG AA is a launch gate (PRD §11).',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photographer or source, if attribution is needed.',
      },
    },
  ],
}
