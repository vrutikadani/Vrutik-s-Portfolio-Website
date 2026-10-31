import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Evidence classes. Every system page shows its class so a reader knows
// what kind of proof sits behind it. See /about/#evidence.
export const EVIDENCE = [
  'verified-work',      // dated deliverable, approval or system record exists
  'firsthand',          // Vrutik's own account; proof held privately
  'synthetic-public',   // public repo on synthetic data
  'interview-design',   // designed for a hiring case; never deployed
  'hypothetical',       // illustrative example
] as const;

const systems = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/systems' }),
  schema: z.object({
    title: z.string(),
    premise: z.string(),            // one sentence with a point of view
    kind: z.enum(['Agent', 'Revenue system', 'Finance control', 'Reference build', 'Experiment']),
    context: z.string(),            // where and when
    evidence: z.array(z.enum(EVIDENCE)).min(1),
    order: z.number(),
    featured: z.boolean().default(false),
    overview: z.object({
      problem: z.string(),
      decision: z.string(),
      result: z.string(),
      interesting: z.string(),
    }),
    owned: z.string(),
    collaborators: z.string().optional(),
    stack: z.array(z.string()),
    links: z.object({
      repo: z.url().optional(),
      demo: z.url().optional(),
    }).default({}),
    publicTwin: z.string().optional(), // explains how the public repo relates to private work
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    kind: z.enum(['Essay', 'Field note', 'Teardown']),
    topics: z.array(z.string()).max(4),
    related: z.array(z.string()).default([]), // system ids
    linkedin: z.object({
      summary: z.string(),
      hooks: z.array(z.string()).min(2).max(3),
    }).optional(),
    speakingAngle: z.string().optional(),
  }),
});

export const collections = { systems, writing };
