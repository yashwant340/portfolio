/// <reference types="vite/client" />

declare module 'virtual:projects' {
  import type { ProjectMeta } from './content/schema'
  const projects: (ProjectMeta & { html: string })[]
  export default projects
}
