// Tiny event hook. Never sends form text, emails or anything typed.
// Cloudflare Web Analytics counts page views only, so custom events go to
// window.dataLayer if a future tool (GA4, Plausible) is added. Until then
// they stay in the page and are visible to tests via a DOM event.

type Props = Record<string, string | number | boolean>;
const ALLOWED = new Set([
  'project_open', 'demo_launch', 'github_click', 'article_open', 'article_share',
  'linkedin_click', 'contact_click', 'contact_submit', 'speaking_inquiry', 'pivot_open',
  'pivot_route_selected', 'lab_scenario_started', 'lab_scenario_completed', 'resume_download',
]);

declare global { interface Window { dataLayer?: unknown[] } }

export function track(name: string, props: Props = {}) {
  if (!ALLOWED.has(name)) return;
  const event = { event: name, ...props };
  window.dataLayer?.push(event);
  window.dispatchEvent(new CustomEvent('site:track', { detail: event }));
}

// Any element with data-track="event_name" reports a click.
// Extra data-track-* attributes become properties (route, slug, scenario).
export function wireTracking() {
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (!el) return;
    const props: Props = {};
    for (const [k, v] of Object.entries(el.dataset)) {
      if (k.startsWith('track') && k !== 'track' && v) props[k.slice(5).toLowerCase()] = v;
    }
    track(el.dataset.track!, props);
  });
}
