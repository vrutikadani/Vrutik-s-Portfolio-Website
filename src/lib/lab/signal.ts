// Port of product-signal-router decision logic v1.5.0 (simplified).
import type { Step } from './lead';

export interface SignalInput {
  usage: boolean; adoption: boolean; breadth: boolean;
  partitionLoaded: boolean; youngAccount: boolean; oneUserHeavy: boolean; domainMatch: boolean;
  identityUnique: boolean; ownerActive: boolean; openOpp: boolean; twoWayRecent: boolean; openSignal: boolean;
}
export type Decision = 'SURFACE' | 'HOLD' | 'SUPPRESS' | 'ROUTE' | 'NO_SIGNAL';
export interface SignalResult { strength: 'NONE' | 'MEDIUM' | 'HIGH'; confidence: 'LOW' | 'MEDIUM' | 'HIGH'; reasons: string[]; steps: Step[]; decision: Decision; why: string }

export function evaluateSignal(s: SignalInput): SignalResult {
  const steps: Step[] = [];
  const fams = [s.usage && 'usage / value', s.adoption && 'organizational adoption', s.breadth && 'product breadth'].filter(Boolean) as string[];
  const strength = fams.length === 0 ? 'NONE' : fams.length === 1 ? 'MEDIUM' : 'HIGH';
  steps.push({ mark: 'rules', text: `Strength ${strength}: ${fams.length ? fams.join(' + ') : 'no family fired'}`, code: 'signals.py: strength()' });

  // Confidence starts HIGH and is lowered, with a stated reason.
  const reasons: string[] = [];
  if (!s.partitionLoaded) reasons.push('warehouse partition missing');
  if (s.youngAccount) reasons.push('under 45 days of history');
  if (s.oneUserHeavy) reasons.push('over 80% of use from one user');
  if (s.domainMatch) reasons.push('CRM matched by domain, not ID');
  const confidence: SignalResult['confidence'] = !s.partitionLoaded ? 'LOW' : reasons.length ? 'MEDIUM' : 'HIGH';
  steps.push({ mark: 'rules', text: `Confidence ${confidence}${reasons.length ? ` (${reasons.join('; ')})` : ''}`, code: 'signals.py: confidence()' });

  if (strength === 'NONE') return { strength, confidence, reasons, steps, decision: 'NO_SIGNAL', why: 'Nothing qualifying changed. Silence is the right answer.' };

  const rules: [boolean, string, Decision, string][] = [
    [s.identityUnique, 'Identity resolves to exactly one CRM account', 'ROUTE', 'Identity is ambiguous. A reviewer decides which account this is.'],
    [s.ownerActive, 'The account has an active owner', 'ROUTE', 'Nobody active owns it. Route to the ownership queue, not to a random seller.'],
    [!s.openOpp, 'No open opportunity', 'SUPPRESS', 'A seller is already working a deal here. Another alert would be noise.'],
    [!s.twoWayRecent, 'No two-way conversation in the last 14 days', 'SUPPRESS', 'The seller is already talking to them.'],
    [s.partitionLoaded, 'Today’s data is loaded', 'HOLD', 'Stale data. Wait a day rather than act on a gap.'],
    [!s.openSignal, 'No earlier signal still open and unanswered', 'HOLD', 'One open signal per account. Re-sending teaches sellers to ignore the feed.'],
  ];
  for (const [ok, text, fail, why] of rules) {
    steps.push({ mark: 'rules', text, blocking: !ok, code: 'actionability.py' });
    if (!ok) return { strength, confidence, reasons, steps, decision: fail, why };
  }
  if (confidence === 'LOW') return { strength, confidence, reasons, steps, decision: 'HOLD', why: 'Low confidence holds the signal.' };
  steps.push({ mark: 'model', text: 'Optional AI note: sees only strength, confidence and families. Runs after the decision; can fail safely', code: 'ai_context.py' });
  return { strength, confidence, reasons, steps, decision: 'SURFACE', why: 'Send to the owner, ranked by strength then confidence, with the evidence attached.' };
}
