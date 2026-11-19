/**
 * SITE CONFIG: everything that is NOT translated text.
 * Contact details, donation numbers, social links, stats, the order of sections.
 *
 * ⚠ Values marked PLACEHOLDER must be replaced with the foundation's real details.
 * When a backend exists, this object will come from the API instead
 * (see src/services/content.js → getSiteConfig()).
 */
export const siteConfig = {
  defaultLang: 'bn',
  languages: [
    { code: 'bn', label: 'বাংলা', short: 'বাং', dir: 'ltr', intl: 'bn-BD' },
    { code: 'en', label: 'English', short: 'EN', dir: 'ltr', intl: 'en-US' },
    { code: 'ar', label: 'العربية', short: 'عربي', dir: 'rtl', intl: 'ar-EG' },
  ],

  logo: '/images/logo.jpeg',
  established: 2026,

  contact: {
    phone: '+880 1XXX-XXXXXX', // PLACEHOLDER
    email: 'info@sangufoundation.org', // PLACEHOLDER
    whatsapp: '8801XXXXXXXXX', // PLACEHOLDER (digits only, used for wa.me link)
    mapUrl: 'https://maps.google.com/?q=Sangu+River,+Bandarban', // PLACEHOLDER
  },

  socials: [
    { id: 'facebook', url: '#' }, // PLACEHOLDER
    { id: 'youtube', url: '#' }, // PLACEHOLDER
    { id: 'whatsapp', url: '#' }, // PLACEHOLDER
  ],

  /** Donation channels. The label of each one is translated in locales → donate.methods.<id> */
  donationMethods: [
    { id: 'bkash', kind: 'mobile', number: '01XXXXXXXXX', color: '#e2136e', accountType: 'personal' }, // PLACEHOLDER
    { id: 'nagad', kind: 'mobile', number: '01XXXXXXXXX', color: '#f6921e', accountType: 'personal' }, // PLACEHOLDER
    { id: 'rocket', kind: 'mobile', number: '01XXXXXXXXX-X', color: '#8c3494', accountType: 'personal' }, // PLACEHOLDER
    {
      id: 'bank',
      kind: 'bank',
      number: 'XXXX XXXX XXXX', // PLACEHOLDER
      bankName: 'Bank name', // PLACEHOLDER
      branch: 'Branch', // PLACEHOLDER
      accountName: 'Sangu Humanitarian Foundation',
      color: '#1e4590',
    },
  ],

  /**
   * Hero counters. These are real facts from the constitution, not invented impact numbers.
   * Replace with real impact figures (families helped, volunteers…) once they exist.
   * The label of each one lives in locales → stats.<id>
   */
  stats: [
    { id: 'programs', value: 8 },
    { id: 'objectives', value: 12 },
    { id: 'principles', value: 7 },
    { id: 'founded', value: 2026, plain: true },
  ],

  /** Footer credit. The "Design & Developed by" label is translated in locales → footer.credit */
  credit: {
    name: 'Azizul Hoque',
    url: 'https://azizulhoque01.github.io/azizulhoque/',
  },

  /** Committee members. Leave name/photo null to show "To be announced". */
  committee: {
    president: { name: null, photo: null },
    vicePresident: { name: null, photo: null },
    generalSecretary: { name: null, photo: null },
    jointSecretary: { name: null, photo: null },
    treasurer: { name: null, photo: null },
    organizingSecretary: { name: null, photo: null },
    publicitySecretary: { name: null, photo: null },
    executiveMembers: { name: null, photo: null },
  },

  /**
   * Order of the sections on the page. Remove an id to hide a section.
   * The ids that appear in the navigation are listed in `nav`.
   */
  sections: [
    'hero',
    'about',
    'visionMission',
    'programs',
    'objectives',
    'principles',
    'donate',
    'involved',
    'transparency',
    'committee',
    'pledge',
    'contact',
  ],
  nav: ['hero', 'about', 'programs', 'donate', 'involved', 'transparency', 'contact'],
};
