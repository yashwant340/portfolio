import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children?: ReactNode
  as?: 'div' | 'li' | 'section' | 'article'
  className?: string
  /** Stagger position; each step adds 90ms delay. */
  index?: number
  /** Extra delay in ms, added to the stagger. */
  delay?: number
  /** `rise` fades and lifts; `line` draws a line (see .reveal-line). */
  variant?: 'rise' | 'line'
  style?: CSSProperties
}

// Fades and lifts its children into place the first time they scroll into view.
// The class is toggled on the element directly, so revealing never re-renders.
export function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  index = 0,
  delay = 0,
  variant = 'rise',
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => el.classList.add('is-visible')

    // Content already on screen at load shows immediately; some browsers delay
    // or skip the observer's first callback (e.g. emulated or background tabs).
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) return show()
    if (!('IntersectionObserver' in window)) return show()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show()
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`${variant === 'line' ? 'reveal-line' : 'reveal'} ${className}`}
      style={{ ...style, '--delay': `${index * 90 + delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
