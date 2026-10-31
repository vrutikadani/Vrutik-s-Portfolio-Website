// Port of ai-sdr-agent's qualify.py and pipeline rules (simplified).
// Source: github.com/vrutikadani/ai-sdr-agent  sdr_agent/qualify.py, pipeline.py

export type Mark = 'rules' | 'model' | 'person';
export interface Step { mark: Mark; text: string; delta?: string; code?: string; blocking?: boolean }

export const SPECIALTIES = ['Dermatology', 'Plastic surgery', 'Med spa', 'Aesthetics', 'Dentistry', 'Other'] as const;
const TARGET: Record<string, number> = { dermatology: 30, 'plastic surgery': 30, 'med spa': 20, aesthetics: 20 };
const FREE_MAIL = new Set(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com']);
const SIGNALS: [RegExp, number, string][] = [
  [/\b(price|pricing|cost|quote)\b/, 20, 'asked about pricing'],
  [/\b(demo|trial|see it)\b/, 15, 'asked for a demo'],
  [/\b(buy|purchase|financ\w*|lease)\b/, 20, 'purchase or financing intent'],
  [/\b(this (month|quarter)|asap|soon)\b/, 10, 'near-term timeline'],
  [/\b(add(ing)? (a )?(new )?service|expand\w*)\b/, 10, 'expanding services'],
];
export const QUALIFY = 50;
export const STOP_BELOW = 10;

export interface LeadInput { specialty: string; email: string; message: string; suppressed: boolean }
export interface LeadResult { score: number; steps: Step[]; route: 'suppressed' | 'stop' | 'sdr' | 'draft'; outcome: string }

export function scoreLead(l: LeadInput): LeadResult {
  const steps: Step[] = [];
  if (l.suppressed) {
    steps.push({ mark: 'rules', text: 'Address is on the suppression list', blocking: true, code: 'crm.py: is_suppressed()' });
    return { score: 0, steps, route: 'suppressed', outcome: 'Stop. No email, no task. An opt-out is a legal fact.' };
  }
  let score = 0;
  const spec = l.specialty.trim().toLowerCase();
  const hit = Object.keys(TARGET).find((k) => spec.includes(k));
  if (hit) { score += TARGET[hit]; steps.push({ mark: 'rules', text: `Target specialty (${l.specialty})`, delta: `+${TARGET[hit]}`, code: 'qualify.py: TARGET_SPECIALTIES' }); }
  else steps.push({ mark: 'rules', text: `Not a target specialty (${l.specialty || 'blank'})`, delta: '+0', code: 'qualify.py: TARGET_SPECIALTIES' });

  const domain = (l.email.split('@')[1] ?? '').toLowerCase().trim();
  if (FREE_MAIL.has(domain)) { score -= 10; steps.push({ mark: 'rules', text: 'Free email domain', delta: '−10', code: 'qualify.py: FREE_MAIL' }); }
  else { score += 10; steps.push({ mark: 'rules', text: 'Business email domain', delta: '+10', code: 'qualify.py: FREE_MAIL' }); }

  const msg = l.message.toLowerCase();
  for (const [re, pts, label] of SIGNALS) {
    if (re.test(msg)) { score += pts; steps.push({ mark: 'rules', text: label[0].toUpperCase() + label.slice(1), delta: `+${pts}`, code: 'qualify.py: BUYING_SIGNALS' }); }
  }
  if (/\b(student|job|career|resume|hiring)\b/.test(msg)) {
    score -= 40; steps.push({ mark: 'rules', text: 'Not a buyer (job or student inquiry)', delta: '−40', code: 'qualify.py: score_lead()' });
  }
  score = Math.max(0, Math.min(100, score));

  if (score >= QUALIFY) return { score, steps, route: 'sdr', outcome: `Score ${score} ≥ ${QUALIFY}. Straight to an SDR task, with every reason above attached.` };
  if (score < STOP_BELOW) return { score, steps, route: 'stop', outcome: `Score ${score} < ${STOP_BELOW}. Stop. Nobody spends time on this one.` };
  steps.push({ mark: 'rules', text: 'Draft from an approved template, then guardrails: right recipient, no unfilled {{fields}}, length, banned claims', code: 'guardrails.py: check_draft()' });
  return { score, steps, route: 'draft', outcome: `Score ${score} sits between ${STOP_BELOW} and ${QUALIFY}. The agent sends one short email and waits for a reply.` };
}

// ---- Reply handling. The classifier output here is a fixed stand-in for
// a model call, labelled as such in the UI.
export interface ReplyPreset { id: string; text: string; label: string; confidence: number }
export const REPLIES: ReplyPreset[] = [
  { id: 'interested', text: 'Yes, can someone call me Thursday about pricing?', label: 'interested', confidence: 0.93 },
  { id: 'question', text: 'Does it work on darker skin types?', label: 'question', confidence: 0.84 },
  { id: 'stop', text: 'STOP', label: 'unclear', confidence: 0.41 },
  { id: 'mixed', text: 'Pricing please. Actually never mind, take me off your list.', label: 'interested', confidence: 0.71 },
  { id: 'who', text: 'Who is this?', label: 'unclear', confidence: 0.38 },
  { id: 'later', text: 'Not this year, maybe next spring.', label: 'not_now', confidence: 0.88 },
];
// Same pattern as the repo's pipeline.py.
const OPT_OUT = /\b(unsubscribe|remove me|stop emailing|opt[- ]?out|take me off|(do not|don'?t) (contact|email|e-mail|message))\b|^\s*stop[.!]?\s*$/i;
export const REVIEW_BELOW = 0.6;

export function handleReply(r: ReplyPreset): { steps: Step[]; outcome: string; action: string } {
  const steps: Step[] = [];
  if (OPT_OUT.test(r.text)) {
    steps.push({ mark: 'rules', text: 'Opt-out language matched by rule, before the model ever sees the reply', blocking: true, code: 'pipeline.py: OPT_OUT' });
    steps.push({ mark: 'model', text: 'Model not called. A confident wrong label can never override an unsubscribe' });
    return { steps, action: 'suppress', outcome: 'Suppress the address for good and log the opt-out. No review needed.' };
  }
  steps.push({ mark: 'model', text: `Model labels the reply “${r.label}” at confidence ${r.confidence.toFixed(2)}`, code: 'llm.py: classify_reply()' });
  if (r.confidence < REVIEW_BELOW || r.label === 'unclear') {
    steps.push({ mark: 'person', text: `Below ${REVIEW_BELOW} or unclear, so a person reads it`, code: 'pipeline.py: needs_review' });
    return { steps, action: 'review', outcome: 'Human review queue. Nothing is sent until a person decides.' };
  }
  const map: Record<string, [string, string]> = {
    interested: ['handoff', 'SDR task with the thread and the reasons attached.'],
    question: ['draft', 'Draft an answer from approved content, through guardrails again.'],
    not_now: ['nurture', 'Move to nurture. No more first-touch emails.'],
  };
  const [action, outcome] = map[r.label] ?? ['review', 'Unknown label goes to a person.'];
  steps.push({ mark: 'rules', text: `Label picks a branch in code: ${action}`, code: 'pipeline.py: next_step()' });
  return { steps, action, outcome };
}
