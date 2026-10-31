export const EVIDENCE_INFO = {
  'verified-work': {
    label: 'Verified work',
    glyph: '✓',
    meaning: 'Dated deliverables, approvals or system records exist. Some are internal and shared on request, not published.',
  },
  firsthand: {
    label: 'Firsthand account',
    glyph: '◐',
    meaning: 'My own account of work I did. I hold the supporting records privately and will walk through them in a conversation.',
  },
  'synthetic-public': {
    label: 'Public code, synthetic data',
    glyph: '{ }',
    meaning: 'A public repository you can run. Built on synthetic data. Never employer code.',
  },
  'interview-design': {
    label: 'Hiring case',
    glyph: '◇',
    meaning: 'Designed for a take-home or interview case. Never deployed at a company.',
  },
  hypothetical: {
    label: 'Illustrative',
    glyph: '~',
    meaning: 'A made-up example to show reasoning. Numbers are illustrative.',
  },
} as const;

export type EvidenceKey = keyof typeof EVIDENCE_INFO;
