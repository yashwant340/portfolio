import { useEffect, useRef } from 'react'

// The pointer becomes a small accent dot with a soft ring trailing it. The ring
// grows over links and buttons and shows a label over anything with data-cursor
// ("View", "Flip"), hiding the dot. Elements with data-magnetic lean toward the
// pointer. Mouse only; touch devices and reduced motion keep the normal pointer.
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    const d = dot.current
    if (!el || !d || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    root.classList.add('custom-cursor')

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
      const labelled = target.closest<HTMLElement>('[data-cursor]')
      const interactive = target.closest('a, button, [role="button"]')
      // A link or button inside a labelled card keeps the plain hover ring (e.g. "Code" on a project card)
      const label = labelled && !(interactive && interactive !== labelled && labelled.contains(interactive)) ? labelled.dataset.cursor : undefined
      el.dataset.state = label ? 'label' : interactive ? 'hover' : ''
      el.textContent = label ?? ''
      d.style.translate = `${x}px ${y}px`
      d.style.opacity = label ? '0' : '1'

      const m = target.closest<HTMLElement>('[data-magnetic]')
      if (magnet && magnet !== m) magnet.style.transform = ''
      magnet = m
      if (m) {
        const r = m.getBoundingClientRect()
        m.style.transform = `translate(${(x - (r.left + r.width / 2)) * 0.25}px, ${(y - (r.top + r.height / 2)) * 0.35}px)`
      }
      el.style.opacity = '1'
    }
    const onLeave = () => {
      el.style.opacity = '0'
      d.style.opacity = '0'
    }
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
      root.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ring} aria-hidden className="cursor-ring" />
      <div ref={dot} aria-hidden className="cursor-dot" />
    </>
  )
}
