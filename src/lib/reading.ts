// Reading time from the actual word count at 230 words per minute.
// Code blocks and markdown syntax are stripped first so tables and fences
// don't inflate the estimate.
export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`|\[\]()-]/g, ' ');
  const words = text.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
  return Math.max(1, Math.round(words / 230));
}
