// Scenario 6 of gtm-decision-engine, condensed. Synthetic people and accounts.
export interface CrmRow { key: string; write: string; status: 'live' | 'correct' | 'reverted' | 'pending' | 'cancelled' }
export interface Frame { title: string; who: 'rules' | 'model' | 'person'; detail: string; crm: CrmRow[] }

const accept: CrmRow[] = [
  { key: 'assoc-1', write: 'Link contact P-502 (Chris Walker) → Redwood Plastic Surgery', status: 'live' },
  { key: 'task-2', write: 'Task for Dana: reach out to Chris at Redwood', status: 'live' },
];

export function frames(fixed: boolean): Frame[] {
  return [
    {
      title: '1. Signal arrives', who: 'rules',
      detail: 'A vendor reports that Chris Walker joined Redwood Plastic Surgery. Our CRM contact for Chris has a profile URL that matches, so identity scores 0.94. Above the threshold, so code calls it a match.',
      crm: [],
    },
    {
      title: '2. Dana accepts the card', who: 'person',
      detail: 'Dana, the seller, presses Accept. The outbox worker writes to the CRM. Each write has an idempotency key, so a retry cannot duplicate it.',
      crm: accept,
    },
    {
      title: '3. Dana corrects it: wrong person', who: 'person',
      detail: 'Dana calls and finds a different Chris Walker. Our CRM had someone else’s profile URL. She presses Correct → wrong person.',
      crm: accept,
    },
    fixed
      ? {
          title: '4. The correction compensates', who: 'rules',
          detail: '“Wrong person” maps to the writes it makes untrue: the association and the task. A compensating step reads what the CRM actually holds, then reverts it. The exclusion stops the match coming back, and a data-quality task fixes the bad URL.',
          crm: [
            { key: 'assoc-1', write: 'Link contact P-502 → Redwood', status: 'reverted' },
            { key: 'task-2', write: 'Task for Dana: reach out to Chris', status: 'reverted' },
            { key: 'dq-3', write: 'RevOps task: fix profile URL on P-502', status: 'correct' },
          ],
        }
      : {
          title: '4. The correction only looks forward', who: 'rules',
          detail: 'The correction stores an exclusion, opens a data-quality task, and re-evaluates the signal as SUPPRESSED. Every check passes. Nothing undoes step 2.',
          crm: [
            ...accept,
            { key: 'dq-3', write: 'RevOps task: fix profile URL on P-502', status: 'correct' },
          ],
        },
  ];
}
