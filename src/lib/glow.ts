import type { MouseEvent } from 'react'

// Writes the pointer position into CSS variables so `.glow` layers follow the
// cursor without re-rendering React.
export function trackGlow(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--gx', `${e.clientX - r.left}px`)
  el.style.setProperty('--gy', `${e.clientY - r.top}px`)
}
