import { config, fields, singleton } from '@keystatic/core';

/**
 * GitHub storage mode: every save here commits straight to Mfauf/Portoflio
 * over the GitHub API (no local filesystem writes), which is what triggers
 * the existing Cloudflare Pages build for the portfolio itself. Requires
 * KEYSTATIC_GITHUB_CLIENT_ID / KEYSTATIC_GITHUB_CLIENT_SECRET / KEYSTATIC_SECRET
 * — see cms/.env.example and the README's "Content CMS" section.
 */

const DATA_PATH = 'src/data';

function localized(label: string) {
  return fields.object({
    en: fields.text({ label: `${label} (English)` }),
    ar: fields.text({ label: `${label} (Arabic)` }),
  });
}

function localizedMultiline(label: string) {
  return fields.object({
    en: fields.text({ label: `${label} (English)`, multiline: true }),
    ar: fields.text({ label: `${label} (Arabic)`, multiline: true }),
  });
}

const englishItemLabel = (props: { fields: { en: { value: string } } }) =>
  props.fields.en.value || 'Untitled';

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'Mfauf', name: 'Portoflio' },
  },

  singletons: {
    profile: singleton({
      label: 'Profile',
      path: `${DATA_PATH}/profile`,
      format: { data: 'json' },
      schema: {
        name: localized('Name'),
        shortName: localized('Short name'),
        role: localized('Role'),
        greeting: localized('Greeting'),
        rotatingRoles: fields.array(localized('Rotating role'), {
          label: 'Rotating roles',
          itemLabel: englishItemLabel,
        }),
        tagline: localizedMultiline('Tagline'),
        bio: localizedMultiline('Bio'),
        bioSecondary: localizedMultiline('Secondary bio'),
        avatar: fields.text({ label: 'Avatar image path', description: 'e.g. /profile.jpg' }),
        logo: fields.text({ label: 'Logo image path', description: 'e.g. /logo.png' }),
        location: localized('Location'),
        availability: fields.object({
          open: fields.checkbox({ label: 'Open for freelance work' }),
          label: localized('Availability label'),
        }),
        contact: fields.object({
          email: fields.text({ label: 'Email' }),
          phone: fields.text({ label: 'Phone (display)' }),
          phoneHref: fields.text({ label: 'Phone (tel: href, no +)' }),
          whatsapp: fields.text({ label: 'WhatsApp number (digits only)' }),
        }),
        resume: fields.object({
          url: fields.text({ label: 'Resume file path', description: 'e.g. /docs/cv.pdf' }),
          label: localized('Resume link label'),
        }),
        servicesDeck: fields.object({
          url: fields.text({ label: 'Services deck file path' }),
          label: localized('Services deck link label'),
        }),
        languages: fields.array(
          fields.object({
            name: localized('Language name'),
            level: localized('Level'),
            value: fields.integer({ label: 'Proficiency %', defaultValue: 0 }),
          }),
          { label: 'Languages', itemLabel: (p) => p.fields.name.fields.en.value || 'Untitled' }
        ),
        stats: fields.array(
          fields.object({
            value: fields.number({ label: 'Value', defaultValue: 0 }),
            suffix: fields.text({ label: 'Suffix', defaultValue: '' }),
            decimals: fields.integer({ label: 'Decimal places', defaultValue: 0 }),
            label: localized('Label'),
          }),
          { label: 'Stats', itemLabel: (p) => p.fields.label.fields.en.value || 'Untitled' }
        ),
      },
    }),

    addons: singleton({
      label: 'Addons & Terms',
      path: `${DATA_PATH}/addons`,
      format: { data: 'json' },
      schema: {
        paid: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            icon: fields.text({ label: 'Icon name' }),
            title: localized('Title'),
            note: localized('Note'),
            price: fields.integer({ label: 'Price (QAR)', defaultValue: 0 }),
          }),
          { label: 'Paid add-ons', itemLabel: (p) => p.fields.title.fields.en.value || 'Untitled' }
        ),
        free: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            icon: fields.text({ label: 'Icon name' }),
            title: localized('Title'),
            note: localized('Note'),
          }),
          { label: 'Free add-ons', itemLabel: (p) => p.fields.title.fields.en.value || 'Untitled' }
        ),
        terms: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            title: localized('Title'),
            body: localizedMultiline('Body'),
          }),
          { label: 'Terms', itemLabel: (p) => p.fields.title.fields.en.value || 'Untitled' }
        ),
      },
    }),

    certificates: singleton({
      label: 'Certificates',
      path: `${DATA_PATH}/certificates`,
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            title: localized('Title'),
            issuer: localized('Issuer'),
            year: fields.integer({ label: 'Year', defaultValue: new Date().getFullYear() }),
            category: fields.select({
              label: 'Category',
              options: [
                { label: 'AI', value: 'ai' },
                { label: 'Engineering', value: 'engineering' },
                { label: 'Academic', value: 'academic' },
                { label: 'Leadership', value: 'leadership' },
                { label: 'Volunteer', value: 'volunteer' },
                { label: 'Quran', value: 'quran' },
              ],
              defaultValue: 'academic',
            }),
            description: localizedMultiline('Description'),
            image: fields.text({
              label: 'Scan image path',
              description: 'e.g. /certificates/example.webp — leave blank for none',
            }),
            url: fields.text({ label: 'Verification URL', description: 'Leave blank for none' }),
          }),
          { label: 'Certificates', itemLabel: (p) => p.fields.title.fields.en.value || 'Untitled' }
        ),
      },
    }),

    education: singleton({
      label: 'Education',
      path: `${DATA_PATH}/education`,
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            degree: localized('Degree'),
            institution: localized('Institution'),
            start: fields.text({ label: 'Start year' }),
            end: fields.text({ label: 'End year', description: 'Leave blank if ongoing' }),
            current: fields.checkbox({ label: 'Currently studying here' }),
            score: fields.object({
              label: localized('Score label'),
              value: fields.text({ label: 'Score value' }),
            }),
            notes: fields.array(localized('Note'), {
              label: 'Notes',
              itemLabel: (p) => p.fields.en.value || 'Untitled',
            }),
          }),
          { label: 'Education', itemLabel: (p) => p.fields.degree.fields.en.value || 'Untitled' }
        ),
      },
    }),

    experience: singleton({
      label: 'Experience',
      path: `${DATA_PATH}/experience`,
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            type: fields.select({
              label: 'Type',
              options: [
                { label: 'Work', value: 'work' },
                { label: 'Volunteer', value: 'volunteer' },
              ],
              defaultValue: 'work',
            }),
            role: localized('Role'),
            organisation: localized('Organisation'),
            location: localized('Location'),
            start: fields.text({ label: 'Start year' }),
            end: fields.text({ label: 'End year', description: 'Leave blank if ongoing' }),
            current: fields.checkbox({ label: 'Currently active' }),
            highlights: fields.array(localizedMultiline('Highlight'), {
              label: 'Highlights',
              itemLabel: (p) => p.fields.en.value || 'Untitled',
            }),
          }),
          { label: 'Experience', itemLabel: (p) => p.fields.role.fields.en.value || 'Untitled' }
        ),
      },
    }),

    process: singleton({
      label: 'Process steps',
      path: `${DATA_PATH}/process`,
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            icon: fields.text({ label: 'Icon name' }),
            title: localized('Title'),
            body: localizedMultiline('Body'),
          }),
          { label: 'Process steps', itemLabel: (p) => p.fields.title.fields.en.value || 'Untitled' }
        ),
      },
    }),

    projects: singleton({
      label: 'Projects',
      path: `${DATA_PATH}/projects`,
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            title: localized('Title'),
            tagline: localized('Tagline'),
            description: localizedMultiline('Description'),
            image: fields.text({ label: 'Image path', description: 'e.g. /projects/example.webp' }),
            url: fields.text({ label: 'Live URL', description: 'Leave blank for none' }),
            repo: fields.text({ label: 'Repo URL', description: 'Leave blank for none' }),
            year: fields.integer({ label: 'Year', defaultValue: new Date().getFullYear() }),
            featured: fields.checkbox({ label: 'Featured' }),
            tags: fields.array(fields.text({ label: 'Tag' }), {
              label: 'Tags',
              itemLabel: (p) => p.value || 'Untitled',
            }),
            category: localized('Category'),
          }),
          { label: 'Projects', itemLabel: (p) => p.fields.title.fields.en.value || 'Untitled' }
        ),
      },
    }),

    services: singleton({
      label: 'Services',
      path: `${DATA_PATH}/services`,
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            icon: fields.text({ label: 'Icon name' }),
            title: localized('Title'),
            summary: localizedMultiline('Summary'),
            price: fields.object({
              amount: fields.integer({ label: 'Amount (QAR)', defaultValue: 0 }),
              from: fields.checkbox({ label: 'Show as "from"' }),
            }),
            duration: localized('Duration'),
            features: fields.array(localized('Feature'), {
              label: 'Features',
              itemLabel: (p) => p.fields.en.value || 'Untitled',
            }),
            example: fields.object({
              label: fields.text({ label: 'Example label', description: 'Leave blank for no example' }),
              url: fields.text({ label: 'Example URL' }),
            }),
            featured: fields.checkbox({ label: 'Featured' }),
          }),
          { label: 'Services', itemLabel: (p) => p.fields.title.fields.en.value || 'Untitled' }
        ),
      },
    }),

    skills: singleton({
      label: 'Skills',
      path: `${DATA_PATH}/skills`,
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            title: localized('Group title'),
            items: fields.array(
              fields.object({
                name: fields.text({ label: 'Name' }),
                icon: fields.text({ label: 'Icon path', description: 'e.g. /tech/react.svg' }),
              }),
              { label: 'Skills', itemLabel: (p) => p.fields.name.value || 'Untitled' }
            ),
          }),
          { label: 'Skill groups', itemLabel: (p) => p.fields.title.fields.en.value || 'Untitled' }
        ),
      },
    }),

    social: singleton({
      label: 'Social links',
      path: `${DATA_PATH}/social`,
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            label: fields.text({ label: 'Label' }),
            handle: fields.text({ label: 'Handle' }),
            url: fields.text({ label: 'URL' }),
            icon: fields.select({
              label: 'Icon',
              options: [
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'GitHub', value: 'github' },
                { label: 'Mail', value: 'mail' },
              ],
              defaultValue: 'github',
            }),
            brandColor: fields.text({ label: 'Brand color (hex)' }),
            primary: fields.checkbox({ label: 'Primary' }),
          }),
          { label: 'Social links', itemLabel: (p) => p.fields.label.value || 'Untitled' }
        ),
      },
    }),
  },
});
