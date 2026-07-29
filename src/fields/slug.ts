import type { Field } from 'payload'

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * URL slug, derived from a source field when left blank.
 *
 * Derivation happens in beforeValidate rather than in the admin UI so that
 * seeded and API-created documents get a slug too, not just ones typed into
 * the panel.
 */
export const slugField = (from = 'title'): Field[] => [
  {
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    admin: {
      position: 'sidebar',
      description: 'Leave blank to generate from the title. Changing this breaks existing links.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.length > 0) return slugify(value)
          const source = data?.[from]
          if (typeof source === 'string' && source.length > 0) return slugify(source)
          return value
        },
      ],
    },
  },
]
