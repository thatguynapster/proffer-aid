import type { CollectionConfig } from 'payload'

import { hasRole, isAdmin, isAdminOrLeadEditor, isNobody } from '../access'

export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'amount', 'status', 'source', 'campaign', 'paidAt'],
    group: 'Administration',
    description:
      'Financial records. Card and mobile money entries are written by the Paystack webhook; offline gifts are recorded here by hand.',
  },
  access: {
    // Never publicly readable. Campaign pages render only the aggregate,
    // never an individual record (PRD §11f).
    read: isAdminOrLeadEditor,
    // Lead Editors record offline gifts. The webhook writes with
    // overrideAccess, so it does not need a role here.
    create: isAdminOrLeadEditor,
    // Amending a financial record is an Admin action.
    update: isAdmin,
    // Donation records are never deleted — deleting one silently changes a
    // published fundraising total and destroys the audit trail.
    delete: isNobody,
  },

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation !== 'create') return data
        // Anything created through the admin panel is by definition an offline
        // gift — webhook writes never pass through a logged-in user. Forcing
        // the values here means a Lead Editor cannot mislabel a manual entry
        // as a card payment, deliberately or otherwise.
        if (req.user && hasRole(req.user, 'admin', 'leadEditor')) {
          data.source = 'offline'
          data.mode = 'live'
          data.status = 'success'
          if (!data.reference) {
            data.reference = `offline_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
          }
        }
        return data
      },
    ],
  },

  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Paystack transaction reference, or a generated one for offline gifts.',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description:
          'Amount in pesewas (GHS × 100), matching what Paystack sends. 50 cedis is 5000.',
      },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'GHS',
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
      ],
      index: true,
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'test',
      options: [
        { label: 'Live', value: 'live' },
        { label: 'Test', value: 'test' },
      ],
      index: true,
      admin: {
        readOnly: true,
        description:
          'Only live records count toward public totals. Test-mode traffic can never inflate a campaign.',
      },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'paystack',
      options: [
        { label: 'Paystack', value: 'paystack' },
        { label: 'Offline (bank transfer, cash, cheque, in-kind)', value: 'offline' },
      ],
      index: true,
    },
    {
      name: 'campaign',
      type: 'relationship',
      relationTo: 'campaigns',
      index: true,
      admin: {
        description:
          'Leave blank for a general donation. Only campaign-attributed gifts move a progress bar.',
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'donorName',
      type: 'text',
      admin: { description: 'Optional. Only collect what is needed for reconciliation.' },
    },
    {
      name: 'donorEmail',
      type: 'email',
      admin: { description: 'Optional. Never displayed publicly.' },
    },
    {
      name: 'note',
      type: 'textarea',
      admin: { description: 'For offline gifts — e.g. the bank reference or what was donated.' },
    },
  ],
}
