// Unit tests for the Decision Lab ports. Each case mirrors a behavior
// documented in the public repos, so the lab can't quietly drift from them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreLead, handleReply, REPLIES } from '../../src/lib/lab/lead';
import { assignOwner } from '../../src/lib/lab/owner';
import { evaluateSignal, type SignalInput } from '../../src/lib/lab/signal';
import { frames } from '../../src/lib/lab/correction';
import { population, evaluate } from '../../src/lib/lab/tradeoff';
import { esc, renderSteps } from '../../src/lib/lab/render';
import { readingMinutes } from '../../src/lib/reading';

const lead = (o: Partial<Parameters<typeof scoreLead>[0]> = {}) =>
  scoreLead({ specialty: 'Dermatology', email: 'a@clinic.com', message: '', suppressed: false, ...o });

test('home page example scores 80 and goes to an SDR', () => {
  const r = lead({ message: "Hi, what does financing look like? We're adding a new service this quarter." });
  assert.equal(r.score, 80);
  assert.equal(r.route, 'sdr');
});

test('students are stopped, not emailed', () => {
  const r = lead({ specialty: 'Other', email: 'x@gmail.com', message: "I'm a student writing a paper" });
  assert.equal(r.route, 'stop');
});

test('suppression wins before any scoring', () => {
  const r = lead({ suppressed: true, message: 'pricing demo buy asap' });
  assert.equal(r.route, 'suppressed');
  assert.equal(r.steps.length, 1);
});

test('score is clamped to 0..100', () => {
  const r = lead({ message: 'price demo purchase this quarter adding a new service' });
  assert.ok(r.score <= 100);
});

test('every opt-out reply is suppressed without calling the model', () => {
  for (const id of ['stop', 'mixed']) {
    const r = handleReply(REPLIES.find((x) => x.id === id)!);
    assert.equal(r.action, 'suppress', id);
  }
});

test('low-confidence replies go to a person', () => {
  assert.equal(handleReply(REPLIES.find((x) => x.id === 'who')!).action, 'review');
});

const base = { lifecycle: 'mql', specialty: 'Med spa', medicalDirector: 'blank', zip: '92801', manualLock: false, customer: false, corporate: false, state: 'CA' } as const;

test('manual handoff is never overwritten', () => {
  assert.equal(assignOwner({ ...base, manualLock: true }, 'Pat').owner, 'Pat');
});

test('med spa without a medical director goes inside', () => {
  assert.match(assignOwner({ ...base }).owner, /inside/);
});

test('medical director yes goes outside by ZIP', () => {
  const r = assignOwner({ ...base, specialty: 'Dermatology', medicalDirector: 'yes' });
  assert.match(r.owner, /outside/);
  assert.match(r.path, /ZIP/);
});

test('outside-eligible lead in an area with no outside rep goes inside', () => {
  const r = assignOwner({ ...base, specialty: 'Dermatology', medicalDirector: 'yes', zip: '75201' });
  assert.match(r.owner, /inside/);
});

const sig: SignalInput = { usage: true, adoption: true, breadth: false, partitionLoaded: true, youngAccount: false, oneUserHeavy: false, domainMatch: false, identityUnique: true, ownerActive: true, openOpp: false, twoWayRecent: false, openSignal: false };

test('two families = HIGH strength and it surfaces', () => {
  const r = evaluateSignal(sig);
  assert.equal(r.strength, 'HIGH');
  assert.equal(r.decision, 'SURFACE');
});

test('strong, trusted signal with an open opportunity is suppressed', () => {
  assert.equal(evaluateSignal({ ...sig, openOpp: true }).decision, 'SUPPRESS');
});

test('ambiguous identity routes before anything else', () => {
  assert.equal(evaluateSignal({ ...sig, identityUnique: false, openOpp: true }).decision, 'ROUTE');
});

test('no families fired = NO_SIGNAL', () => {
  assert.equal(evaluateSignal({ ...sig, usage: false, adoption: false }).decision, 'NO_SIGNAL');
});

test('missing partition holds', () => {
  assert.equal(evaluateSignal({ ...sig, partitionLoaded: false }).decision, 'HOLD');
});

test('correction: before the fix the CRM writes stay live; after, they are reverted', () => {
  const before = frames(false).at(-1)!.crm;
  const after = frames(true).at(-1)!.crm;
  assert.ok(before.some((r) => r.status === 'live'));
  assert.ok(!after.some((r) => r.status === 'live'));
});

test('tradeoff: a higher threshold sends more to review and fewer wrong actions', () => {
  const pop = population();
  const c = { wrongCost: 30, reviewMinutes: 3, capacity: 40, perDay: 120 };
  const lo = evaluate(pop, { ...c, threshold: 0.4 });
  const hi = evaluate(pop, { ...c, threshold: 0.9 });
  assert.ok(hi.reviewPerDay > lo.reviewPerDay);
  assert.ok(hi.wrongAutoPerDay < lo.wrongAutoPerDay);
});

test('tradeoff population is deterministic', () => {
  assert.deepEqual(population().slice(0, 5), population().slice(0, 5));
});

test('renderers escape user input', () => {
  assert.equal(esc('<img src=x onerror=1>'), '&lt;img src=x onerror=1&gt;');
  const html = renderSteps([{ mark: 'rules', text: '<script>alert(1)</script>' }]);
  assert.ok(!html.includes('<script>'));
});

test('reading time counts words, not markdown', () => {
  assert.equal(readingMinutes('word '.repeat(460)), 2);
  assert.equal(readingMinutes('```\n' + 'code '.repeat(2000) + '\n```\nhi'), 1);
});
