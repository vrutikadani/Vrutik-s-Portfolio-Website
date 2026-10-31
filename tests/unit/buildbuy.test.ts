import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareBuildBuy, DEFAULT_BUILD_BUY, formatK } from '../../src/lib/lab/buildbuy';
import { renderBuildBuyChart, renderBuildBuyMetrics } from '../../src/lib/lab/render';

test('default totals include setup, delay, 36 months of upkeep and rule changes', () => {
  const r = compareBuildBuy(DEFAULT_BUILD_BUY);
  assert.equal(r.build.total, 108000);
  assert.ok(Math.abs(r.buy.total - 103800) < 0.001);
  assert.equal(r.build.weeks, 12);
  assert.ok(Math.abs(r.buy.weeks - 4.2) < 0.001);
  assert.equal(r.winner, 'buy');
  assert.match(r.verdict, /Buy costs \$4.2K less/);
  assert.ok(Math.abs(r.ruleBreakEven! - 4.7) < 0.001);
  assert.equal(r.points.length, 37);
  assert.equal(r.points[36].build, r.build.total);
  assert.equal(r.points[36].buy, r.buy.total);
});

test('crossover is the interpolated month when cumulative costs change order', () => {
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, annualLicense: 36000, changesPerYear: 0 });
  assert.ok(Math.abs(r.crossoverMonth! - 39000 / 1800) < 0.001);
  assert.ok(r.points[21].build > r.points[21].buy);
  assert.ok(r.points[22].build < r.points[22].buy);
  assert.match(renderBuildBuyChart(r), /Crossover at month 21.7/);
});

test('no crossover is reported when the intersection is outside the horizon', () => {
  const r = compareBuildBuy(DEFAULT_BUILD_BUY);
  assert.equal(r.crossoverMonth, null);
  assert.match(renderBuildBuyChart(r), /No crossover in months 1–36/);
});

test('zero rule changes incur no change work for either option', () => {
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, changesPerYear: 0 });
  assert.equal(r.build.ruleChanges, 0);
  assert.equal(r.buy.ruleChanges, 0);
  assert.equal(r.build.total, 103200);
  assert.equal(r.buy.total, 75000);
});

test('very frequent rule changes favor build at the default labor assumptions', () => {
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, changesPerYear: 52 });
  assert.equal(r.build.ruleChanges, 62400);
  assert.equal(r.buy.ruleChanges, 374400);
  assert.equal(r.winner, 'build');
  assert.match(r.verdict, /Build costs .* less/);
});

test('100% feature coverage adds no workaround implementation weeks', () => {
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, coverage: 100 });
  assert.equal(r.buy.weeks, DEFAULT_BUILD_BUY.integrationWeeks);
  assert.equal(r.buy.setup, 12000);
  assert.equal(r.buy.delay, 3000);
});

test('zero coverage includes a full build plus integration before first value', () => {
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, coverage: 0 });
  assert.equal(r.buy.weeks, 15);
  assert.equal(r.buy.setup, 60000);
});

test('$K formatting uses at most one decimal, including small and large costs', () => {
  for (const [value, expected] of [[0, '$0K'], [1000, '$1K'], [12550, '$12.6K'], [1234567, '$1234.6K'], [49, '$0K']] as const) {
    assert.equal(formatK(value), expected);
  }
  assert.match(renderBuildBuyMetrics(compareBuildBuy(DEFAULT_BUILD_BUY)), /\$103.8K/);
});

test('parallel coincident costs tie with no spurious crossover or division by zero', () => {
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, buildWeeks: 1, integrationWeeks: 1, coverage: 100, maintenanceHours: 1, annualLicense: 1200, changesPerYear: 0 });
  assert.equal(r.winner, 'tie');
  assert.equal(r.crossoverMonth, null);
  assert.match(r.verdict, /costs tie/);
});

test('break-even rule frequency actually equalizes totals', () => {
  const zero = compareBuildBuy(DEFAULT_BUILD_BUY);
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, changesPerYear: zero.ruleBreakEven! });
  assert.equal(r.winner, 'tie');
});

test('no rule-change threshold is invented when build is already cheaper at zero changes', () => {
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, annualLicense: 100000, changesPerYear: 0 });
  assert.equal(r.ruleBreakEven, null);
  assert.equal(r.winner, 'build');
  assert.match(r.verdict, /maintenance versus license cost/);
});

test('invalid values fail explicitly and a zero hourly rate remains finite', () => {
  for (const patch of [{ coverage: 101 }, { buildWeeks: -1 }, { hourlyCost: NaN }, { annualLicense: Infinity }]) {
    assert.throws(() => compareBuildBuy({ ...DEFAULT_BUILD_BUY, ...patch }), RangeError);
  }
  const r = compareBuildBuy({ ...DEFAULT_BUILD_BUY, hourlyCost: 0 });
  assert.equal(r.ruleBreakEven, null);
  assert.ok(Number.isFinite(r.build.total));
  assert.ok(!/NaN|Infinity/.test(renderBuildBuyChart(r)));
});
