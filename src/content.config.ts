import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const datasets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/datasets' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    purpose: z.string(),
    ethical_use: z.object({
      allowed: z.array(z.string()),
      forbidden: z.array(z.string()),
    }),
    frontier: z.string(),
    accessibility: z.object({
      trial: z.string(),
      standard: z.string(),
      enterprise: z.string(),
    }),
    citation: z.string(),
    agi_relevance: z.string(),
    automation_load: z.string(),
    hf_url: z.string().optional(),
    launch_date: z.string(),
    status: z.enum(['draft', 'announced', 'live']),
  }),
});

export const collections = { datasets };
