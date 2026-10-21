// Validates everything in src/content before a build.
// Errors (missing fields, bad URLs, unknown project slugs) fail the build;
// TODO placeholders are listed as warnings so you can see what is left to fill.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'
import { about } from '../src/content/about.ts'
import { beyond } from '../src/content/beyond.ts'
import { capabilities } from '../src/content/capabilities.ts'
import { journey } from '../src/content/journey.ts'
import { profile } from '../src/content/profile.ts'
import {
  aboutSchema,
  beyondSchema,
  capabilitySchema,
  journeySchema,
  profileSchema,
  projectSchema,
} from '../src/content/schema.ts'
import { splitFrontmatter } from '../src/lib/frontmatter.ts'

const errors: string[] = []
const todos: string[] = []

function check(label: string, schema: z.ZodType, value: unknown) {
  const result = schema.safeParse(value)
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`${label} → ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    }
  }
  findTodos(label, value, [])
}

function findTodos(label: string, value: unknown, path: (string | number)[]) {
  if (typeof value === 'string' && value.includes('TODO')) {
    todos.push(`${label} → ${path.join('.')}: ${value}`)
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => findTodos(label, v, [...path, i]))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) findTodos(label, v, [...path, k])
  }
}

check('profile.ts', profileSchema, profile)
check('capabilities.ts', z.array(capabilitySchema), capabilities)
check('about.ts', aboutSchema, about)
check('journey.ts', journeySchema, journey)
check('beyond.ts', beyondSchema, beyond)

const dir = join(import.meta.dirname, '../src/content/projects')
const slugs = new Set<string>()
for (const name of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const label = `projects/${name}`
  try {
    const { data, body } = splitFrontmatter(readFileSync(join(dir, name), 'utf8'), label)
    check(label, projectSchema, data)
    findTodos(label, body, ['body'])
    const slug = (data as { slug?: string }).slug
    if (slug) {
      if (slugs.has(slug)) errors.push(`${label}: duplicate slug "${slug}"`)
      if (`${slug}.md` !== name) errors.push(`${label}: slug "${slug}" should match the file name`)
      slugs.add(slug)
    }
  } catch (e) {
    errors.push((e as Error).message)
  }
}

const orgs = new Set(journey.steps.map((s) => s.org).filter(Boolean))
capabilities.forEach((cap, i) => {
  for (const ref of cap.usedIn) {
    if (!slugs.has(ref) && !orgs.has(ref)) {
      errors.push(`capabilities.ts → ${i}.usedIn: "${ref}" is not a project slug or a journey.ts org`)
    }
  }
})

if (todos.length) {
  console.warn(`\n${todos.length} TODO placeholder(s) left:`)
  for (const t of todos) console.warn(`  · ${t}`)
}
if (errors.length) {
  console.error(`\n✗ Content has ${errors.length} error(s):`)
  for (const e of errors) console.error(`  · ${e}`)
  process.exit(1)
}
console.log('\n✓ Content is valid.')
