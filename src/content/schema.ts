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
  // Hero: the headline's **highlighted** words are set in italic accent; the line under it rotates through `builds`
  hero: z.object({
    buildsLead: text,
    builds: z.array(text).min(1).max(5),
    workButton: text,
  }),
  // The swinging ID badge in the hero; the back lists quick facts and links
  badge: z.object({
    top: text,
    bottomLeft: text,
    bottomRight: text,
    facts: z.array(z.object({ label: text, value: text })).min(1).max(6),
  }),
  contact: z.object({ heading: text, text, button: text }),
  // Closing band on story-layout project pages; contact.text sits under it
  projectCta: z.object({ heading: text }),
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
  // Optional headline number shown large in the skills spotlight
  stat: z.object({ value: text, label: text }).optional(),
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
        // Pin label on the home page journey map
        place: text.optional(),
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

// A box on the detailed architecture map; `info` shows when it is hovered or tapped
// `queue` marks the service that sends judge jobs or receives verdicts through the queue
const mapNode = z.object({
  title: text,
  detail: text,
  info: text,
  mine: z.boolean().default(false),
  queue: z.enum(['job', 'verdict']).optional(),
})

// One chapter of the story layout. `type` picks which part of the write-up it shows;
// `decisions` are indexes into `decisions`, `highlight` names a latency row or failure to mark as mine.
// A `feature` chapter groups one feature's write-up: `paragraph` (of the body text), `challenge`,
// `decisions` and `limits` are indexes. The pinned panel shows `stat`, or the chapter's name
// when it has no honest number. `label` names the chapter in the rail and kicker.
const storyChapter = z.object({
  type: z.enum(['overview', 'built', 'architecture', 'decision', 'decisions', 'latency', 'failures', 'feature']),
  label: text.optional(),
  heading: text,
  stat: z.object({ value: text, label: text }).optional(),
  mine: z.boolean().default(false),
  items: z.array(z.object({ title: text, body: text })).optional(),
  decisions: z.array(z.number().int().min(0)).optional(),
  highlight: text.optional(),
  paragraph: z.number().int().min(0).optional(),
  challenge: z.number().int().min(0).optional(),
  limits: z.array(z.number().int().min(0)).optional(),
})

const shippedProject = z.object({
  status: z.literal('shipped'),
  slug: text,
  order: z.number(),
  // Up to three headline numbers for the home page card (taken from the write-up)
  proof: z.array(z.object({ value: text, label: text })).min(1).max(3).optional(),
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
    // One repository holding the whole project
    code: url.optional(),
    live: url.optional(),
  }),
  // false hides the "Try the live app · soon" badge for a project that won't be hosted
  liveSoon: z.boolean().default(true),
  // Short line under the links, e.g. how to run the project locally
  note: text.optional(),
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
  // Optional story layout (see storyChapter) and the detailed map its architecture chapter uses
  story: z.array(storyChapter).min(2).optional(),
  // Either a distributed map (gateway, services, queue, worker) or a single-service one
  // (an API holding `modules`, with `stores` below it). Both trace one request with a moving dot.
  diagram: z
    .union([
      z.object({
        // Label on the line from the client to the gateway
        requestLabel: text,
        client: mapNode,
        gateway: mapNode,
        services: z.array(mapNode).min(1).max(4),
        queue: mapNode,
        worker: mapNode,
        observability: mapNode.optional(),
      }),
      z.object({
        requestLabel: text,
        // What the moving dot traces, e.g. "one sync"
        trace: text,
        client: mapNode,
        server: mapNode,
        modules: z.array(mapNode).min(2).max(4),
        // Which module the dot passes through
        traceModule: z.number().int().min(0),
        stores: z.array(mapNode.extend({ link: text })).length(2),
      }),
    ])
    .optional(),
  // Design choices and why, shown between Architecture and Key challenges
  // `tradeoff` is what the choice cost; shown as a muted line under the reason
  decisions: z.array(z.object({ title: text, body: text, tradeoff: text.optional() })).optional(),
  // Index of the decision that frames the whole project; story pages show it in a band above the story
  keyDecision: z.number().int().min(0).optional(),
  // Measured results: headline numbers, a p50/p99 latency chart and injected failures
  results: z
    .object({
      intro: text.optional(),
      stats: z.array(z.object({ value: text, label: text })).min(1).max(4),
      latency: z
        .object({
          rows: z.array(z.object({ label: text, p50: z.number(), p99: z.number() })).min(1),
          note: text.optional(),
        })
        .optional(),
      failures: z.array(z.object({ failure: text, outcome: text })).optional(),
    })
    .optional(),
  challenges: z.array(z.object({ title: text, body: text })).min(1).optional(),
  limitations: z.array(z.object({ issue: text, next: text })).min(1).optional(),
})

const inProgressProject = z.object({
  status: z.literal('in-progress'),
  slug: text,
  order: z.number(),
  title: text,
  summary: text,
  // Optional preview details shown on the home strip until the full write-up exists
  role: text.optional(),
  services: z.array(text).optional(),
  stack: z.array(text).optional(),
})

export const projectSchema = z.discriminatedUnion('status', [shippedProject, inProgressProject])

export type Profile = z.input<typeof profileSchema>
export type Capability = z.input<typeof capabilitySchema>
export type About = z.input<typeof aboutSchema>
export type Journey = z.input<typeof journeySchema>
export type Beyond = z.input<typeof beyondSchema>
export type ProjectMeta = z.output<typeof projectSchema>
export type ShippedProject = Extract<ProjectMeta, { status: 'shipped' }>
export type InProgressProject = Extract<ProjectMeta, { status: 'in-progress' }>
