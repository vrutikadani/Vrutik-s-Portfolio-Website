// Illustrative only. A seeded synthetic population of 500 replies with a
// model confidence and whether the model's label was actually right.
// Used to show how a review threshold trades errors against review load.

function rng(seed: number) {
  return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
}

export interface Reply { conf: number; correct: boolean }
export function population(n = 500, seed = 7): Reply[] {
  const r = rng(seed);
  const out: Reply[] = [];
  for (let i = 0; i < n; i++) {
    const conf = Math.min(0.99, Math.max(0.05, 0.35 + 0.6 * Math.sqrt(r()) + (r() - 0.5) * 0.15));
    // Higher confidence is more often right, but never perfectly.
    const pRight = 0.25 + 0.72 * conf;
    out.push({ conf, correct: r() < pRight });
  }
  return out;
}

export interface Costs { threshold: number; wrongCost: number; reviewMinutes: number; capacity: number; perDay: number }
export interface TradeoffResult {
  autoShare: number; reviewPerDay: number; wrongAutoPerDay: number; overflow: number; dailyCost: number;
}
export function evaluate(pop: Reply[], c: Costs): TradeoffResult {
  const auto = pop.filter((p) => p.conf >= c.threshold);
  const review = pop.length - auto.length;
  const wrongAuto = auto.filter((p) => !p.correct).length;
  const scale = c.perDay / pop.length;
  const reviewPerDay = review * scale;
  const wrongAutoPerDay = wrongAuto * scale;
  const overflow = Math.max(0, reviewPerDay - c.capacity);
  // Cost in "minutes of someone's time": review time plus wrong actions.
  // Overflow is reviewed late; we count it as half a wrong action each.
  const dailyCost = Math.min(reviewPerDay, c.capacity) * c.reviewMinutes + wrongAutoPerDay * c.wrongCost + overflow * c.wrongCost * 0.5;
  return { autoShare: auto.length / pop.length, reviewPerDay, wrongAutoPerDay, overflow, dailyCost };
}

export function curve(pop: Reply[], base: Omit<Costs, 'threshold'>) {
  const pts: { t: number; cost: number }[] = [];
  for (let t = 0.3; t <= 0.96; t += 0.02) pts.push({ t: +t.toFixed(2), cost: evaluate(pop, { ...base, threshold: t }).dailyCost });
  return pts;
}
