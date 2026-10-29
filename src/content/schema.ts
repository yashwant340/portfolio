import { z } from 'zod'

// Placeholders are allowed while content is being written: any string starting
// with "TODO" passes validation and is listed as a warning by `npm run check:content`.
const todo = z.string().startsWith('TODO')
const text = z.string().min(1)
const url = z.union([z.url(), todo], { error: 'must be a full URL (https://…) or a "TODO: …" placeholder' })
const email = z.union([z.email(), todo], { error: 'must be an email address or a "TODO: …" placeholder' })

export const profileSchema = z.object({
  name: text,
  role: text,
  headline: text,
  intro: text,
  status: z.object({ open: z.boolean(), text }),
  contact: z.object({ heading: text, text, button: text }),
  // Home projects section: heading and the counter beside it ("2 built · 1 in progress")
  projectsSection: z.object({ heading: text, builtLabel: text, inProgressLabel: text }),
  // Shown on shipped projects that have no `links.live` yet
  liveDemoSoon: z.object({ label: text, note: text }),
  links: z.object({
    cv: text,
    github: url,
    linkedin: url,
    email,
  }),
})

export const capabilitySchema = z.object({
  title: text,
  description: text,
  tools: z.array(text).min(1),
  // Project slugs (src/content/projects/*.md) or an `org` from journey.ts
  usedIn: z.array(text).min(1),
})

export const aboutSchema = z.object({
  // Wrap words in **double asterisks** to highlight them.
  paragraphs: z.array(text).min(1).max(5),
  facts: z.array(z.object({ label: text, value: text })).min(1).max(6),
})

export const journeySchema = z.object({
  steps: z
    .array(
      z.object({
        period: text,
        title: text,
        detail: text.optional(),
        // Employer or university; capabilities can cite it in `usedIn`
        org: text.optional(),
        state: z.enum(['past', 'current', 'next']).default('past'),
      }),
    )
    .min(1),
})

export const interestIcons = ['film', 'cricket', 'dumbbell', 'music', 'book', 'plane', 'camera', 'sparkle'] as const

export const beyondSchema = z
  .array(z.object({ title: text, detail: text, icon: z.enum(interestIcons).default('sparkle') }))
  .min(1)
  .max(4)

const node = z.object({ title: text, detail: text })

const shippedProject = z.object({
  status: z.literal('shipped'),
  slug: text,
  order: z.number(),
  title: text,
  category: text,
  summary: text,
  tagline: text,
  role: text,
  stack: z.array(text).min(1),
  highlights: z.array(text).min(1).max(3),
  links: z.object({
    frontend: url.optional(),
    backend: url.optional(),
    live: url.optional(),
  }),
  // Paths under /public, e.g. /projects/devmetrics/cover.png
  cover: text.optional(),
  preview: text.optional(),
  clips: z.array(z.object({ title: text, src: text.optional() })).min(1),
  architecture: z.object({
    summary: text,
    client: node,
    clientLink: text,
    server: node,
    services: z.array(node.extend({ link: text })).min(1),
  }),
  challenges: z.array(z.object({ title: text, body: text })).min(1),
  limitations: z.array(z.object({ issue: text, next: text })).min(1),
})

const inProgressProject = z.object({
  status: z.literal('in-progress'),
  slug: text,
  order: z.number(),
  title: text,
  summary: text,
})

export const projectSchema = z.discriminatedUnion('status', [shippedProject, inProgressProject])

export type Profile = z.input<typeof profileSchema>
export type Capability = z.input<typeof capabilitySchema>
export type About = z.input<typeof aboutSchema>
export type Journey = z.input<typeof journeySchema>
export type Beyond = z.input<typeof beyondSchema>
export type ProjectMeta = z.output<typeof projectSchema>
export type ShippedProject = Extract<ProjectMeta, { status: 'shipped' }>
