import type { CollectionConfig } from 'payload'

import { isAdminOrLeadEditor, isNobody } from '../access'
import { sendSubmissionNotification } from '../lib/email'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: { singular: 'Form submission', plural: 'Form submissions' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'formType', 'email', 'createdAt'],
    group: 'Administration',
  },
  access: {
    // Contains personal data. Never publicly readable (PRD §11d).
    read: isAdminOrLeadEditor,
    // Created only through the API route, which uses overrideAccess after
    // validating and spam-checking the payload. Nothing writes here directly.
    create: isNobody,
    update: isNobody,
    delete: isAdminOrLeadEditor,
  },

  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        // Notification failure must never fail the submission — the record is
        // already safely in the database, which is the point of storing
        // submissions rather than relying on email as the only copy.
        try {
          await sendSubmissionNotification(req.payload, doc)
        } catch (error) {
          req.payload.logger.error({ err: error }, 'Failed to send submission notification')
        }
        return doc
      },
    ],
  },

  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Volunteer application', value: 'volunteer' },
        { label: 'Membership application', value: 'membership' },
        { label: 'Partnership inquiry', value: 'partnership' },
      ],
      index: true,
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'organization', type: 'text' },
    { name: 'occupation', type: 'text' },
    { name: 'availability', type: 'text' },
    { name: 'areaOfInterest', type: 'text' },
    { name: 'partnershipType', type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      name: 'handled',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Mark once someone has followed up.' },
    },
  ],
}
