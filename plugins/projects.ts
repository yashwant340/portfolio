import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { marked } from 'marked'
import type { Plugin } from 'vite'
import { projectSchema } from '../src/content/schema.ts'
import { splitFrontmatter } from '../src/lib/frontmatter.ts'

const ID = 'virtual:projects'
const RESOLVED = '\0' + ID

// Turns src/content/projects/*.md into validated data with pre-rendered HTML at
// build time, so the browser never ships the YAML, Markdown or Zod libraries.
// A bad edit shows up as an error overlay in `npm run dev`.
export function projects(dir: string): Plugin {
  return {
    name: 'portfolio-projects',
    resolveId: (id) => (id === ID ? RESOLVED : undefined),
    load(id) {
      if (id !== RESOLVED) return
      const list = readdirSync(dir)
        .filter((f) => f.endsWith('.md'))
        .map((name) => {
          const file = join(dir, name)
          const { data, body } = splitFrontmatter(readFileSync(file, 'utf8'), `projects/${name}`)
          const result = projectSchema.safeParse(data)
          if (!result.success) {
            const issues = result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n')
            throw new Error(`Invalid content in projects/${name}:\n${issues}`)
          }
          return { ...result.data, html: marked.parse(body, { async: false }) }
        })
        .sort((a, b) => a.order - b.order)
      return `export default ${JSON.stringify(list)}`
    },
    configureServer(server) {
      const reload = (file: string) => {
        if (!file.startsWith(dir) || !file.endsWith('.md')) return
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', reload)
      server.watcher.on('change', reload)
      server.watcher.on('unlink', reload)
    },
  }
}
