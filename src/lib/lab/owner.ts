// Port of hubspot-revops-system revops/assignment.py (simplified, synthetic reps).
import type { Step } from './lead';

export interface OwnerInput {
  lifecycle: 'lead' | 'mql' | 'sql';
  specialty: 'Dermatology' | 'Plastic surgery' | 'Med spa' | 'Other medical';
  medicalDirector: 'yes' | 'no' | 'blank';
  zip: string;
  manualLock: boolean;
  customer: boolean;
  corporate: boolean;
  state: string;
}

// Synthetic territory tables. Data, not branches.
export const T = {
  aeByZip: { '92801': 'Riley (outside)', '85281': 'Morgan (outside)' } as Record<string, string>,
  aeByState: { CA: 'Riley (outside)', AZ: 'Morgan (outside)' } as Record<string, string>,
  insideByZip: { '92801': 'Sam (inside)' } as Record<string, string>,
  insideByState: { CA: 'Sam (inside)', AZ: 'Jo (inside)', TX: 'Jo (inside)' } as Record<string, string>,
  pool: ['Sam (inside)', 'Jo (inside)'],
  amByState: { CA: 'Casey (account mgr)', AZ: 'Casey (account mgr)', TX: 'Drew (account mgr)', NY: 'Drew (account mgr)' } as Record<string, string>,
  corporateEast: 'Avery (corporate east)', corporateWest: 'Blake (corporate west)',
  east: new Set(['NY', 'NJ', 'MA', 'FL', 'GA']),
};
export const ZIPS: Record<string, string> = { '92801': 'CA', '85281': 'AZ', '75201': 'TX', '10001': 'NY', '99501': 'AK' };

export function assignOwner(r: OwnerInput, current = 'Taylor (inside)'): { steps: Step[]; owner: string; path: string } {
  const steps: Step[] = [];
  const state = ZIPS[r.zip] ?? r.state;
  if (r.manualLock) {
    steps.push({ mark: 'person', text: 'A rep handed this record over by hand. Lock is on', code: 'assignment.py: manual_lock', blocking: true });
    return { steps, owner: current, path: 'Keep the current owner. Automation never overwrites a person.' };
  }
  steps.push({ mark: 'rules', text: 'No manual handoff lock', code: 'assignment.py: assign()' });
  if (r.customer) {
    steps.push({ mark: 'rules', text: 'Existing customer: customer routing, not new business', code: 'assignment.py: assign_customer()' });
    if (r.corporate) {
      const east = T.east.has(state);
      steps.push({ mark: 'rules', text: `Corporate account in ${state}: ${east ? 'east' : 'west'} split` });
      return { steps, owner: east ? T.corporateEast : T.corporateWest, path: `corporate · ${east ? 'east' : 'west'}` };
    }
    const am = T.amByState[state];
    if (am) { steps.push({ mark: 'rules', text: `Account manager owns ${state}` }); return { steps, owner: am, path: 'account manager · state' }; }
    steps.push({ mark: 'person', text: `No account manager for ${state}. Owner gets a task to fix the data`, code: 'notify, don’t guess' });
    return { steps, owner: 'Marketing queue + data task', path: 'customer with unknown territory' };
  }
  if (r.lifecycle === 'lead') {
    steps.push({ mark: 'rules', text: 'Still a marketing-stage lead', code: 'assignment.py: lifecycle in {subscriber, lead}' });
    return { steps, owner: 'Marketing queue', path: 'marketing stage' };
  }
  let outside = false;
  if (r.lifecycle === 'sql') { outside = true; steps.push({ mark: 'rules', text: 'Sales-qualified: outside eligible' }); }
  else if (r.specialty === 'Med spa') {
    outside = r.medicalDirector === 'yes';
    steps.push({ mark: 'rules', text: `Med spa, medical director: ${r.medicalDirector}. ${outside ? 'Outside' : 'Inside'} sales`, code: 'outside_eligible()' });
  } else if (r.medicalDirector === 'yes') {
    outside = true; steps.push({ mark: 'rules', text: 'Medical practice, medical director: yes. Outside sales', code: 'outside_eligible()' });
  } else {
    steps.push({ mark: 'rules', text: `Medical director: ${r.medicalDirector}. No or blank goes to inside sales`, code: 'policy agreed with sales leaders' });
  }
  const team = outside ? 'outside' : 'inside';
  const byZip = outside ? T.aeByZip : T.insideByZip;
  const byState = outside ? T.aeByState : T.insideByState;
  if (byZip[r.zip]) { steps.push({ mark: 'rules', text: `ZIP ${r.zip} is mapped for ${team} sales` }); return { steps, owner: byZip[r.zip], path: `${team} · ZIP` }; }
  steps.push({ mark: 'rules', text: `ZIP ${r.zip || '(blank)'} not mapped for ${team}. Try state ${state || '(unknown)'}` });
  if (byState[state]) { steps.push({ mark: 'rules', text: `State ${state} has a ${team} owner` }); return { steps, owner: byState[state], path: `${team} · state` }; }
  if (outside) {
    steps.push({ mark: 'rules', text: `No outside rep covers ${state || 'this area'}. Policy: uncovered areas go inside` });
    const s = T.insideByState[state];
    if (s) return { steps, owner: s, path: 'inside · no outside coverage' };
  }
  steps.push({ mark: 'rules', text: 'No coverage at all. Inside round-robin' });
  return { steps, owner: T.pool[0], path: 'inside round-robin' };
}
