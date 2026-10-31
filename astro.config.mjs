// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { readdirSync, readFileSync } from 'node:fs';

// The writing index is noindex while nothing is published, so keep it out of
// the sitemap until at least one piece has `draft: false`.
const hasPublishedWriting = readdirSync('./src/content/writing')
  .some((f) => /^draft:\s*false/m.test(readFileSync(`./src/content/writing/${f}`, 'utf8')));

// SITE_URL is the canonical origin. Change it once the domain is bought.
const site = process.env.SITE_URL || 'https://vrutikadani.com';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    // Small pages: inline the CSS so the first paint needs one request.
    inlineStylesheets: 'always',
  },
  prefetch: {
    // Prefetch internal links on hover/focus so the next page feels instant.
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404') && (hasPublishedWriting || !page.includes('/writing/')),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
});
