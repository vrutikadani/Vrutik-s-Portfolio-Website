// An illustrative cost model, not a port of a real company's economics.
// Costs accrue from kickoff. Setup and delay are booked at month 0;
// license, maintenance and evenly spread rule changes accrue in months 1–36.
export const ASSUMPTIONS = {
  months: 36, hoursPerWeek: 40, buildHoursPerChange: 4, buyHoursPerChange: 24,
} as const;

export interface BuildBuyInput {
  buildWeeks: number;
  maintenanceHours: number;
  hourlyCost: number;
  annualLicense: number;
  integrationWeeks: number;
  coverage: number;
  changesPerYear: number;
  delayCost: number;
}

export const DEFAULT_BUILD_BUY: BuildBuyInput = {
  buildWeeks: 12, maintenanceHours: 12, hourlyCost: 100,
  annualLicense: 18000, integrationWeeks: 3, coverage: 90,
  changesPerYear: 4, delayCost: 1000,
};
export const MAX_RULE_CHANGES = 52;

export interface OptionCost {
  total: number;
  weeks: number;
  setup: number;
  delay: number;
  recurring: number;
  ruleChanges: number;
}
export interface BuildBuyResult {
  build: OptionCost;
  buy: OptionCost;
  points: { month: number; build: number; buy: number }[];
  crossoverMonth: number | null;
  ruleBreakEven: number | null;
  verdict: string;
  winner: 'build' | 'buy' | 'tie';
}

export function formatMoney(dollars: number): string {
  if (Math.abs(dollars) < 1000) return `$${Number(dollars.toFixed(1))}`;
  if (Math.abs(dollars) >= 1000000) return `$${(dollars / 1000000).toFixed(1)}M`;
  return `$${Number((dollars / 1000).toFixed(1))}K`;
}

export function compareBuildBuy(input: BuildBuyInput): BuildBuyResult {
  const { months, hoursPerWeek, buildHoursPerChange, buyHoursPerChange } = ASSUMPTIONS;
  // Reject invalid callers instead of drawing NaN or silently changing inputs.
  if (Object.values(input).some((v) => !Number.isFinite(v) || v < 0) || input.coverage > 100) {
    throw new RangeError('Inputs must be finite and nonnegative; coverage must be 0–100.');
  }
  const years = months / 12;
  const gapWeeks = input.buildWeeks * (1 - input.coverage / 100);
  const option = (weeks: number, monthly: number, changeHours: number): OptionCost => {
    const setup = weeks * hoursPerWeek * input.hourlyCost;
    const delay = weeks * input.delayCost;
    const recurring = monthly * months;
    const ruleChanges = input.changesPerYear * years * changeHours * input.hourlyCost;
    return { weeks, setup, delay, recurring, ruleChanges, total: setup + delay + recurring + ruleChanges };
  };
  const build = option(input.buildWeeks, input.maintenanceHours * input.hourlyCost, buildHoursPerChange);
  const buy = option(input.integrationWeeks + gapWeeks, input.annualLicense / 12, buyHoursPerChange);
  const upfront = build.setup + build.delay - buy.setup - buy.delay;
  const monthlyDifference = (build.recurring + build.ruleChanges - buy.recurring - buy.ruleChanges) / months;
  const crossing = monthlyDifference === 0 ? null : -upfront / monthlyDifference;
  // Month 0 equality is not a crossover; coincident lines have none.
  const crossoverMonth = crossing !== null && crossing > 0 && crossing <= months ? crossing : null;
  const points = Array.from({ length: months + 1 }, (_, month) => ({
    month,
    build: build.setup + build.delay + month / months * (build.recurring + build.ruleChanges),
    buy: buy.setup + buy.delay + month / months * (buy.recurring + buy.ruleChanges),
  }));
  const baseDifference = build.total - build.ruleChanges - (buy.total - buy.ruleChanges);
  const yearlyChangeDifference = years * (buyHoursPerChange - buildHoursPerChange) * input.hourlyCost;
  const ruleBreakEven = yearlyChangeDifference > 0 && baseDifference >= 0 ? baseDifference / yearlyChangeDifference : null;
  const difference = build.total - buy.total;
  const winner = Math.abs(difference) < 0.01 ? 'tie' : difference < 0 ? 'build' : 'buy';
  const saving = `${winner === 'build' ? 'Build' : 'Buy'} costs ${formatMoney(Math.abs(difference))} less over 3 years.`;
  const factors = [
    { name: 'setup engineering effort', difference: build.setup - buy.setup },
    { name: 'maintenance versus license cost', difference: build.recurring - buy.recurring },
    { name: 'rule-change work', difference: build.ruleChanges - buy.ruleChanges },
    { name: 'the cost of waiting', difference: build.delay - buy.delay },
  ];
  const deciding = factors.reduce((a, b) => Math.abs(b.difference) > Math.abs(a.difference) ? b : a).name;
  const verdict = ruleBreakEven !== null && ruleBreakEven > MAX_RULE_CHANGES
    ? `Buy stays cheaper at every rule-change rate on this slider. The biggest gap is ${deciding}.`
    : ruleBreakEven !== null
    ? `${winner === 'tie' ? 'The 3-year costs tie.' : saving} Rule-change work tips the decision: buy wins below ${Number(ruleBreakEven.toFixed(1))} changes a year; build wins above it, with other inputs fixed.`
    : `${winner === 'tie' ? 'The 3-year costs tie.' : saving} The largest cost difference is ${deciding}. ${yearlyChangeDifference > 0 ? 'Build stays cheaper even with no rule changes.' : 'Rule changes add no labor cost at this hourly rate.'}`;
  return { build, buy, points, crossoverMonth, ruleBreakEven, verdict, winner };
}
