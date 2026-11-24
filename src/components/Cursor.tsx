import { useEffect, useRef } from 'react'

// A soft ring that trails the (still visible) pointer: it grows over links and
// buttons, and shows a label over anything with data-cursor="View". Elements with
// data-magnetic lean toward the pointer. Mouse-only; off on touch and with reduced motion.
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let frame = 0
    let magnet: HTMLElement | null = null

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      const target = e.target as Element
      const label = target.closest<HTMLElement>('[data-cursor]')?.dataset.cursor
      const interactive = target.closest('a, button, [role="button"]')
      el.dataset.state = label ? 'label' : interactive ? 'hover' : ''
      el.textContent = label ?? ''

      const m = target.closest<HTMLElement>('[data-magnetic]')
      if (magnet && magnet !== m) magnet.style.transform = ''
      magnet = m
      if (m) {
        const r = m.getBoundingClientRect()
        m.style.transform = `translate(${(x - (r.left + r.width / 2)) * 0.25}px, ${(y - (r.top + r.height / 2)) * 0.35}px)`
      }
      el.style.opacity = '1'
    }
    const onLeave = () => (el.style.opacity = '0')
    const tick = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      el.style.translate = `${rx}px ${ry}px`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      if (magnet) magnet.style.transform = ''
    }
  }, [])

  return <div ref={ring} aria-hidden className="cursor-ring" />
}
