// String renderers shared by the server (first paint, works without JS)
// and the browser (updates on input). Keep them pure and escaped.
import type { Step } from './lead';
import type { Frame } from './correction';

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const WHO = { rules: 'Code', model: 'Model', person: 'Person' } as const;

export function renderSteps(steps: Step[]): string {
  return `<ol class="trace">${steps.map((s) => `
    <li class="t ${s.blocking ? 't--block' : ''}">
      <span class="mark mark--${s.mark}" aria-hidden="true"></span>
      <span class="t-who">${WHO[s.mark]}</span>
      <span class="t-text">${esc(s.text)}${s.blocking ? ' <em class="t-flag">stops here</em>' : ''}${s.code ? `<code class="t-code" data-lens-only="engineering">${esc(s.code)}</code>` : ''}</span>
      ${s.delta ? `<b class="t-delta">${esc(s.delta)}</b>` : '<span></span>'}
    </li>`).join('')}</ol>`;
}

export function renderOutcome(label: string, text: string, tone: 'go' | 'stop' | 'ask' = 'go'): string {
  return `<div class="outcome outcome--${tone}"><p class="o-label">${esc(label)}</p><p class="o-text">${esc(text)}</p></div>`;
}

export function renderFrame(f: Frame): string {
  const rows = f.crm.length
    ? f.crm.map((r) => `<tr class="crm-${r.status}"><td><code>${esc(r.key)}</code></td><td>${esc(r.write)}</td><td>${r.status === 'live' ? 'still live' : r.status}</td></tr>`).join('')
    : '<tr><td colspan="3" class="muted">No CRM writes yet</td></tr>';
  return `
    <div class="frame">
      <p class="f-title"><span class="mark mark--${f.who}" aria-hidden="true"></span> ${esc(f.title)}</p>
      <p>${esc(f.detail)}</p>
      <table class="crm"><caption>What the CRM holds now</caption>
        <thead><tr><th scope="col">Key</th><th scope="col">Write</th><th scope="col">Status</th></tr></thead>
        <tbody>${rows}</tbody></table>
    </div>`;
}

export function renderChart(pts: { t: number; cost: number }[], current: number): string {
  const W = 520, H = 200, P = 34;
  const max = Math.max(...pts.map((p) => p.cost)) * 1.08 || 1;
  const x = (t: number) => P + ((t - 0.3) / (0.96 - 0.3)) * (W - P - 10);
  const y = (c: number) => H - P - (c / max) * (H - P - 12);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)} ${y(p.cost).toFixed(1)}`).join(' ');
  const best = pts.reduce((a, b) => (b.cost < a.cost ? b : a));
  const cur = pts.reduce((a, b) => (Math.abs(b.t - current) < Math.abs(a.t - current) ? b : a));
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Daily cost by review threshold. Lowest cost near ${best.t.toFixed(2)}. Current setting ${current.toFixed(2)}.">
    <line x1="${P}" y1="${H - P}" x2="${W - 10}" y2="${H - P}" class="axis"/>
    <line x1="${P}" y1="10" x2="${P}" y2="${H - P}" class="axis"/>
    <text x="${P}" y="${H - 10}" class="tick">0.30</text><text x="${W - 40}" y="${H - 10}" class="tick">0.96</text>
    <text x="${(W / 2) - 70}" y="${H - 10}" class="tick">review threshold →</text>
    <text x="4" y="16" class="tick">cost</text>
    <path d="${d}" class="line"/>
    <circle cx="${x(best.t)}" cy="${y(best.cost)}" r="5" class="best"/>
    <text x="${x(best.t) + 8}" y="${y(best.cost) + 18}" class="note">cheapest ≈ ${best.t.toFixed(2)}</text>
    <line x1="${x(cur.t)}" y1="10" x2="${x(cur.t)}" y2="${H - P}" class="cur"/>
    <circle cx="${x(cur.t)}" cy="${y(cur.cost)}" r="5" class="curdot"/>
  </svg>`;
}
