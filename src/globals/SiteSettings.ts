import type { GlobalConfig } from 'payload'

import { isAdmin, isAdminField, isAnyone } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Administration',
    description: 'Organisation-wide settings. Admin only.',
  },
  access: {
    read: isAnyone,
    // Editors and Lead Editors are deliberately locked out (PRD §2.4).
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Organisation',
          fields: [
            { name: 'orgName', type: 'text', required: true, defaultValue: 'Proffer Aid International Foundation' },
            { name: 'tagline', type: 'text', defaultValue: 'Racing to save lives' },
            { name: 'vision', type: 'textarea' },
            { name: 'mission', type: 'textarea' },
          ],
        },
        {
          label: 'Impact counters',
          fields: [
            {
              name: 'impactCounters',
              type: 'array',
              maxRows: 4,
              admin: {
                description:
                  'Shown on the home page. Confirm point-in-time figures with PAIF before publishing — see PRD §2.1.',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'number', required: true },
                {
                  name: 'asOf',
                  type: 'text',
                  admin: {
                    description:
                      'Optional qualifier, e.g. "as of 2024". Use for figures that are point-in-time rather than cumulative.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Offices',
          fields: [
            {
              name: 'offices',
              type: 'array',
              admin: { description: 'PAIF operates from two offices — Italy and Ghana (PRD §1).' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'addressLines', type: 'textarea', required: true },
                { name: 'phone', type: 'text' },
                { name: 'hours', type: 'text' },
                { name: 'mapUrl', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'social',
              type: 'group',
              fields: [
                { name: 'facebook', type: 'text' },
                { name: 'instagram', type: 'text' },
                { name: 'twitter', type: 'text' },
                { name: 'linkedin', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Featured',
          fields: [
            {
              name: 'featuredCampaign',
              type: 'relationship',
              relationTo: 'campaigns',
              admin: { description: 'Drives the home page campaign highlight.' },
            },
            {
              name: 'featuredUpdate',
              type: 'relationship',
              relationTo: 'updates',
            },
          ],
        },
        {
          label: 'Donations',
          fields: [
            {
              name: 'donationsEnabled',
              type: 'checkbox',
              defaultValue: false,
              access: { update: isAdminField },
              admin: {
                description:
                  'Master switch (PRD §10). When OFF: every donate CTA disappears, /donate returns 404 and is dropped from the sitemap, and campaign progress bars hide. Defaults to OFF so the site cannot accidentally launch soliciting donations it cannot receive. Turn ON only once the Paystack live account is verified.',
              },
            },
            {
              name: 'impactFraming',
              type: 'textarea',
              admin: {
                description: 'e.g. "GHS 50 funds a market health screening." Shown near the donate button.',
              },
            },
            {
              name: 'bankTransferDetails',
              type: 'textarea',
              admin: { description: 'Shown on the donate page as an alternative to card payment.' },
            },
            {
              name: 'feePercent',
              type: 'number',
              defaultValue: 1.95,
              min: 0,
              max: 10,
              access: { update: isAdminField },
              admin: {
                description:
                  "Paystack's processing fee, as a percentage. Used only for the optional 'cover the transaction fee' checkbox. Editable because processor rates change — confirm the current Ghana rate in your Paystack dashboard rather than trusting this default.",
              },
            },
            {
              name: 'feeCapPesewas',
              type: 'number',
              defaultValue: 10000,
              min: 0,
              access: { update: isAdminField },
              admin: {
                description:
                  'Maximum fee in pesewas (GHS × 100). Paystack caps local fees; 10000 = GHS 100. Set to 0 for no cap.',
              },
            },
          ],
        },
        {
          label: 'Notifications',
          fields: [
            {
              name: 'notificationEmail',
              type: 'email',
              defaultValue: 'info@profferaid.com',
              admin: {
                description:
                  'Where volunteer, membership, and partnership submissions are sent. Editable here so it can change without a deploy.',
              },
            },
          ],
        },
      ],
    },
  ],
}
