import projectList from 'virtual:projects'
import type { ShippedProject } from '../content/schema'

// Short-form content is type-checked by TypeScript; Markdown projects are parsed
// and validated at build time (plugins/projects.ts). `npm run check:content`
// runs the full schema checks and lists remaining TODOs.
export { about } from '../content/about'
export { beyond } from '../content/beyond'
export { capabilities } from '../content/capabilities'
export { journey } from '../content/journey'
export { profile } from '../content/profile'

export const projects = projectList

export type ShippedWithHtml = ShippedProject & { html: string }

export const shippedProjects = projects.filter((p): p is ShippedWithHtml => p.status === 'shipped')

export function findProject(slug: string | undefined) {
  return shippedProjects.find((p) => p.slug === slug)
}
