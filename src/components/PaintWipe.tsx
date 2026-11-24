import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DURATION = 700
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

// A wavy edge at `level` (0 = empty, 1 = full screen), animated by time `t`
function wave(level: number, t: number) {
  const y = 100 - level * 130
  let d = `M0 100 L0 ${y.toFixed(2)}`
  for (let x = 0; x <= 100; x += 2) {
    d += ` L${x} ${(y + Math.sin(x / 12 + t * 6) * 4 + Math.sin(x / 7 - t * 4) * 1.5).toFixed(2)}`
  }
  return `${d} L100 100 Z`
}

// Opening or leaving a project page floods the screen with burnt amber paint,
// switches page underneath, then drains away. Other links navigate as usual.
// Skipped with reduced motion, modifier-clicks and new-tab links.
export function PaintWipe() {
  const path = useRef<SVGPathElement>(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const pending = useRef(false)

  const play = (from: number, to: number) =>
    new Promise<void>((resolve) => {
      const el = path.current
      if (!el) return resolve()
      const start = performance.now()
      let done = false
      const finish = () => {
        if (done) return
        done = true
        el.setAttribute('d', to ? 'M0 0H100V100H0Z' : '')
        resolve()
      }
      const frame = (now: number) => {
        if (done) return
        const t = Math.min(1, (now - start) / DURATION)
        el.setAttribute('d', wave(from + (to - from) * ease(t), now / 1000))
        if (t < 1) requestAnimationFrame(frame)
        else finish()
      }
      requestAnimationFrame(frame)
      // Animation frames pause in background tabs; never let that block navigation
      setTimeout(finish, DURATION + 150)
    })

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const a = (e.target as Element).closest('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      const toProject = url.pathname.startsWith('/projects/')
      const fromProject = location.pathname.startsWith('/projects/')
      if (!toProject && !fromProject) return
      if (url.pathname === location.pathname) return
      e.preventDefault()
      e.stopPropagation()
      pending.current = true
      play(0, 1).then(() => navigate(url.pathname + url.search + url.hash))
    }
    // Capture phase, so this runs before React Router's own link handler
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  })

  useEffect(() => {
    if (!pending.current) return
    pending.current = false
    const id = setTimeout(() => play(1, 0), 60)
    return () => clearTimeout(id)
  }, [pathname])

  return (
    <svg aria-hidden className="pointer-events-none fixed inset-0 z-[90] size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path ref={path} d="" className="fill-accent" />
    </svg>
  )
}
