import type { ReactNode } from 'react'
import type { interestIcons } from '../content/schema'

type Name = (typeof interestIcons)[number]

// Line icons for "Beyond code". Each shape has pathLength="1" so CSS can draw
// it in (see `.draw` in index.css).
const shapes: Record<Name, ReactNode> = {
  film: (
    <>
      <rect pathLength={1} x="3" y="8" width="18" height="13" rx="2" />
      <path pathLength={1} d="M3 8l2.5-4.5 15 0L18 8M8.5 3.5 7 8M14 3.5 12.5 8" />
      <path pathLength={1} d="M10 12.5v5l4-2.5z" />
    </>
  ),
  cricket: (
    <>
      <path pathLength={1} d="M14.5 3.5l3 3-9 9-3-3z" />
      <path pathLength={1} d="M7 14l-3.5 3.5a1.4 1.4 0 0 0 2 2L9 16" />
      <circle pathLength={1} cx="18" cy="17" r="3" />
    </>
  ),
  dumbbell: (
    <>
      <path pathLength={1} d="M7 8v8M17 8v8M4 10v4M20 10v4" />
      <path pathLength={1} d="M7 12h10M2.5 12H4M20 12h1.5" />
    </>
  ),
  music: (
    <>
      <path pathLength={1} d="M9 18V5l11-2v13" />
      <circle pathLength={1} cx="6" cy="18" r="3" />
      <circle pathLength={1} cx="17" cy="16" r="3" />
    </>
  ),
  book: (
    <>
      <path pathLength={1} d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v16H5.5A1.5 1.5 0 0 0 4 20.5z" />
      <path pathLength={1} d="M4 20.5A1.5 1.5 0 0 0 5.5 22H20v-3M8 7h8" />
    </>
  ),
  plane: (
    <path pathLength={1} d="M2.5 12.5 21 4l-5 17-4.5-7.5zM11.5 13.5 21 4" />
  ),
  camera: (
    <>
      <path pathLength={1} d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l2-3h6l2 3h2.5A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" />
      <circle pathLength={1} cx="12" cy="13" r="3.5" />
    </>
  ),
  sparkle: (
    <path pathLength={1} d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z" />
  ),
}

export function InterestIcon({ name, className }: { name: Name; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`draw ${className ?? ''}`}
    >
      {shapes[name]}
    </svg>
  )
}
