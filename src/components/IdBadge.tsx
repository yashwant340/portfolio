import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { profile } from '../lib/content'
import { filled } from '../lib/todo'

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// A staff-style ID badge on a lanyard: it sways gently, swings when dragged,
// and flips to quick facts and links on click, tap, Enter or Space.
// It stays light in both themes because it reads as a physical card.
export function IdBadge() {
  const lanyard = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, moved: 0, startX: 0 })
  const [flipped, setFlipped] = useState(false)
  const { badge, links, name } = profile
  const linkedin = filled(links.linkedin)

  // Spring physics: the badge is pulled back toward a slow idle sway
  useEffect(() => {
    const el = lanyard.current
    if (!el) return
    let angle = 0
    let velocity = 0
    let t = 0
    let frame = 0
    const tick = () => {
      t += 0.016
      if (!drag.current.active) {
        const target = reduceMotion() ? 0 : Math.sin(t * 1.3) * 2.5
        velocity = (velocity + (target - angle) * 0.03) * 0.94
        angle += velocity
      }
      el.style.transform = `rotate(${angle}deg)`
      el.dataset.angle = String(angle)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const onMove = (e: globalThis.PointerEvent) => {
      if (!drag.current.active) return
      drag.current.moved = Math.max(drag.current.moved, Math.abs(e.clientX - drag.current.startX))
      angle = Math.max(-35, Math.min(35, angle - e.movementX * 0.35))
      velocity = -e.movementX * 0.5
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const onPointerDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('a')) return
    drag.current = { active: true, moved: 0, startX: e.clientX }
  }
  const onPointerUp = (e: PointerEvent) => {
    const wasDrag = drag.current.moved >= 6
    drag.current.active = false
    if (!wasDrag && !(e.target as HTMLElement).closest('a')) setFlipped((f) => !f)
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFlipped((f) => !f)
    }
  }

  return (
    <div className="badge-stage">
      <div
        ref={lanyard}
        className="badge-lanyard"
        data-cursor="Flip"
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipped ? 'ID badge, showing quick facts. Press to flip back.' : 'ID badge. Press to flip it for quick facts and links.'}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current.active = false)}
        onKeyDown={onKeyDown}
      >
        <div aria-hidden className="badge-strap" />
        <div aria-hidden className="badge-clip" />
        <div className={`badge-card ${flipped ? 'is-flipped' : ''}`}>
          <div className="badge-inner">
            <div className="badge-face" aria-hidden={flipped}>
              <div className="badge-head">
                <span>{badge.top}</span>
              </div>
              <div className="badge-photo">
                <img src="/portrait.webp" alt={`Portrait of ${name}`} width={720} height={720} draggable={false} />
              </div>
              <div className="text-center">
                <div className="font-serif text-[28px] leading-tight">{name}</div>
              </div>
              <div className="badge-idrow">
                <span>{badge.bottomLeft}</span>
                <span>{badge.bottomRight}</span>
              </div>
              <div aria-hidden className="badge-barcode" />
            </div>
            <div className="badge-face badge-back" aria-hidden={!flipped}>
              <div className="badge-head">
                <span>Quick facts</span>
              </div>
              <dl className="badge-facts">
                {badge.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="badge-links">
                <a href={links.cv} download tabIndex={flipped ? 0 : -1} className="badge-btn is-primary">
                  CV
                </a>
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer" tabIndex={flipped ? 0 : -1} className="badge-btn">
                    LinkedIn
                  </a>
                )}
                <a href={links.github} target="_blank" rel="noreferrer" tabIndex={flipped ? 0 : -1} className="badge-btn">
                  GitHub
                </a>
              </div>
              <div aria-hidden className="badge-barcode" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
