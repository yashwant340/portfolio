import { parse } from 'yaml'

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export function splitFrontmatter(raw: string, file: string): { data: unknown; body: string } {
  const match = FRONTMATTER.exec(raw)
  if (!match) throw new Error(`${file}: missing "---" frontmatter block at the top`)
  return { data: parse(match[1]), body: match[2].trim() }
}
