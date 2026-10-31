// One place for facts that appear on many pages.
// Every line here should be true today. Update it, don't patch pages.

export const SITE = {
  name: 'Vrutik Adani',
  role: 'GTM Systems & AI Engineer',
  thesis: 'I build systems that connect GTM data, decisions, and AI-driven action.',
  description:
    'Vrutik Adani builds AI agents, revenue systems, and CRM architecture that turn messy commercial data into decisions people can trust.',
  locale: 'en_US',
  links: {
    linkedin: 'https://www.linkedin.com/in/vrutikadani/',
    github: 'https://github.com/vrutikadani',
  },
  // Public contact address (confirmed by Vrutik, Oct 31 2026). Empty = LinkedIn only.
  email: 'vrutikadani@gmail.com',
  // Writing marked `draft: true` only appears when SHOW_DRAFTS=true.
  showDrafts: import.meta.env.SHOW_DRAFTS === 'true',
  // Cloudflare Web Analytics token. Empty = no analytics script at all.
  cfBeaconToken: import.meta.env.PUBLIC_CF_BEACON_TOKEN ?? '',
  // Off until cost, accuracy and privacy are reviewed. See docs/PIVOT_AI.md.
  pivotAiEnabled: false,
} as const;

export const NAV = [
  { href: '/systems/', label: 'Systems' },
  { href: '/lab/', label: 'Decision Lab' },
  { href: '/writing/', label: 'Writing' },
  { href: '/about/', label: 'About' },
  { href: '/speaking/', label: 'Speaking' },
  { href: '/contact/', label: 'Contact' },
] as const;
