// Pivot is deterministic on purpose: every suggestion is a real page plus
// a stated reason. No model, no visitor profiling, nothing remembered except
// whether the visitor hid the guide.

export interface PivotLink { href: string; title: string; why: string }
export interface PivotRoute { id: string; ask: string; angle: number; links: PivotLink[] }

export function buildRoutes(opts: { hasWriting: boolean }): PivotRoute[] {
  const agentWriting: PivotLink[] = opts.hasWriting
    ? [{ href: '/writing/the-model-writes-the-email/', title: 'The model writes the email. Code decides who gets one.', why: 'The short version of the rule, with the failure modes.' }]
    : [];

  return [
    {
      id: 'build', ask: 'Show me what you build', angle: -40,
      links: [
        { href: '/systems/', title: 'Systems', why: 'Six systems. Each opens with a 30-second summary, then goes deeper.' },
        { href: '/lab/', title: 'Decision Lab', why: 'Change the inputs and watch a real rule set decide.' },
      ],
    },
    {
      id: 'eng', ask: "I'm hiring for an engineering role", angle: 10,
      links: [
        { href: '/systems/gtm-decision-engine/', title: 'GTM Decision Engine', why: 'Architecture decisions, 40 tests, a written postmortem.' },
        { href: '/systems/ai-first-touch-agent/#engineering', title: 'AI first-touch agent: engineering view', why: 'Guardrails, the eval set, and what CI refuses to ship.' },
        { href: '/about/#experience', title: 'Experience', why: 'Roles, dates and what each one actually involved.' },
        { href: '/resume.pdf', title: 'Resume (PDF)', why: 'Two pages, for your applicant tracker.' },
      ],
    },
    {
      id: 'product', ask: "I'm interested in product leadership", angle: 55,
      links: [
        { href: '/systems/ai-first-touch-agent/#product', title: 'Launching on evidence, not a date', why: 'Why the agent stayed in draft mode until 50+ reviews.' },
        { href: '/systems/hubspot-revops-system/#product', title: 'Routing is policy', why: 'Turning a coverage decision leaders agree on into rules.' },
        { href: '/about/', title: 'About', why: 'From a 0-to-1 consumer app to commercial systems.' },
      ],
    },
    {
      id: 'ai', ask: 'How do you approach AI agents?', angle: 100,
      links: [
        ...agentWriting,
        { href: '/systems/ai-first-touch-agent/', title: 'AI first-touch agent', why: 'What the model may decide, and what it never may.' },
        { href: '/lab/#lead', title: 'Lab: should the agent email this lead?', why: 'Try it with your own form message.' },
      ],
    },
    ...(opts.hasWriting
      ? [{
          id: 'writing', ask: 'Show me your writing', angle: 150,
          links: [{ href: '/writing/', title: 'Writing', why: 'Field notes from building revenue systems.' }],
        }]
      : []),
    {
      id: 'collab', ask: "I'd like to collaborate", angle: 200,
      links: [{ href: '/contact/', title: 'Contact', why: 'Pick what you have in mind; it routes to the right channel.' }],
    },
    {
      id: 'speak', ask: "I'm looking for a speaker", angle: 250,
      links: [
        { href: '/speaking/', title: 'Speaking', why: 'Talk topics I can give, and the writing behind them.' },
      ],
    },
  ];
}
