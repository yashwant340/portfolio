import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { journey, profile } from '../lib/content'

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const year = (period: string) => period.match(/\d{4}/)?.[0] ?? period

// Pin positions on the 100 × 64 map, in step order (Chennai, Bangalore, Dublin, next).
// Each route segment is drawn while its destination's step is in view.
const PINS = [
  { x: 81, y: 47, label: { x: 2.8, y: 1, anchor: 'start' } },
  { x: 74, y: 48, label: { x: -3, y: 5, anchor: 'end' } },
  { x: 17, y: 13, label: { x: -3, y: -3, anchor: 'end' } },
  { x: 30, y: 28, label: { x: 3, y: 1, anchor: 'start' } },
] as const
const SEGMENTS = [
  { to: 1, d: 'M81 47 Q78 49 74 48', speed: 1.6 },
  { to: 2, d: 'M74 48 Q52 0 17 13', speed: 1.4, plane: true },
  { to: 3, d: 'M17 13 Q26 18 30 28', speed: 1.6, dashed: true },
]

// The journey pins while you scroll through it: the pop-out avatar and the
// current step on the left, the route drawing itself across the map, and a
// clickable list of every step. Each step owns an equal slice of the scroll.
export function JourneyMap() {
  const steps = journey.steps.slice(0, PINS.length)
  const section = useRef<HTMLElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const pop = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const n = steps.length

  useEffect(() => {
    const el = section.current
    const map = svg.current
    if (!el || !map) return
    const segs = [...map.querySelectorAll<SVGPathElement>('.route-draw')]
    const plane = map.querySelector<SVGGElement>('.route-plane')
    // Browsers already fire scroll at most once per frame, so update directly
    const update = () => {
      const r = el.getBoundingClientRect()
      const p = clamp(-r.top / (r.height - innerHeight)) * 0.999
      const k = Math.floor(p * n)
      const local = p * n - k
      SEGMENTS.forEach((s, i) => {
        const done = k > s.to ? 1 : k === s.to ? clamp(local * s.speed) : 0
        segs[i].style.strokeDashoffset = String(1 - done)
        if (s.plane && plane) {
          const flying = k === s.to && local < 0.72
          plane.style.opacity = flying ? '1' : '0'
          if (flying) {
            const len = segs[i].getTotalLength()
            const at = len * clamp(local * s.speed)
            const pt = segs[i].getPointAtLength(at)
            const ahead = segs[i].getPointAtLength(Math.min(len, at + 0.5))
            const behind = segs[i].getPointAtLength(Math.max(0, at - 0.5))
            const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI
            plane.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${angle})`)
          }
        }
      })
      setStep(k)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [n])

  // The frame tilts toward the cursor and the cut-out moves further, so it reads as 3D
  useEffect(() => {
    const el = pop.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (!r.width || r.bottom < 0 || r.top > innerHeight) return
      const x = (e.clientX - (r.left + r.width / 2)) / innerWidth
      const y = (e.clientY - (r.top + r.height / 2)) / innerHeight
      el.style.setProperty('--tx', `${x}`)
      el.style.setProperty('--ty', `${y}`)
    }
    addEventListener('pointermove', onMove)
    return () => removeEventListener('pointermove', onMove)
  }, [])

  const goTo = (i: number) => {
    const el = section.current
    if (!el) return
    const top = el.offsetTop + (el.offsetHeight - innerHeight) * ((i + 0.55) / n)
    scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  const current = steps[step] ?? steps[0]
  const places = steps.map((s) => s.place).filter(Boolean)

  return (
    <section
      id="journey"
      ref={section}
      className="journey-track mx-auto max-w-[1180px] px-6"
      style={{ '--steps': n } as CSSProperties}
    >
      <div className="journey-stage">
        <div className="journey-left">
          <div className="journey-eyebrow text-xs font-bold tracking-[0.16em] text-accent uppercase">Journey</div>
          <div ref={pop} className="journey-pop" aria-hidden>
            <div className="journey-pop-frame" />
            <img className="journey-pop-img" src="/portrait.webp" alt="" width={720} height={720} />
          </div>
          <div key={step} className="journey-chapter">
            <div className="journey-year font-serif">{year(current.period)}</div>
            <h3 className="journey-title font-serif">{current.title}</h3>
            {current.detail && <p className="journey-detail">{current.detail}</p>}
          </div>
        </div>

        <div className="journey-map rounded-[28px] border border-line bg-surface p-3 sm:p-[18px]">
          <svg
            ref={svg}
            viewBox="0 0 100 64"
            className="block h-auto w-full overflow-visible"
            role="img"
            aria-label={`Map of ${profile.name}'s journey: ${places.join(' → ')}`}
          >
            <defs>
              <pattern id="journey-dots" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
                <circle cx="1.2" cy="1.2" r=".28" className="fill-fg/20" />
              </pattern>
            </defs>
            <rect width="100" height="64" fill="url(#journey-dots)" />
            <path className="fill-sage/45" d="M8 8 Q14 2 22 6 Q27 12 22 20 Q14 24 9 18 Q4 13 8 8Z" />
            <path className="fill-sage/45" d="M66 30 Q80 24 90 32 Q93 44 84 56 Q76 62 70 52 Q62 42 66 30Z" />
            <text className="journey-land" x="15" y="26">
              IRELAND
            </text>
            <text className="journey-land" x="72" y="61">
              INDIA
            </text>
            {SEGMENTS.map((s) => (
              <g key={s.d}>
                <path className={`route-base ${s.dashed ? 'is-dashed' : ''}`} d={s.d} />
                <path className={`route-draw ${s.dashed ? 'is-dashed' : ''}`} pathLength={1} d={s.d} />
              </g>
            ))}
            {steps.map((s, i) => {
              const pin = PINS[i]
              return (
                <g
                  key={i}
                  transform={`translate(${pin.x} ${pin.y})`}
                  className={`journey-pin ${i <= step ? 'is-on' : ''} ${i === step ? 'is-now' : ''} ${s.state === 'next' ? 'is-next' : ''}`}
                >
                  <circle r="2.2" />
                  {s.place && (
                    <text x={pin.label.x} y={pin.label.y} textAnchor={pin.label.anchor}>
                      {s.place}
                    </text>
                  )}
                </g>
              )
            })}
            <g className="route-plane" style={{ opacity: 0 }}>
              <path d="M-2.6 0.5 L-0.6 0.2 L0.9 2.3 L1.5 2.3 L0.8 0.1 L2.3 -0.1 Q2.9 -0.2 2.9 -0.5 Q2.9 -0.8 2.3 -0.9 L0.8 -1.1 L1.5 -3.3 L0.9 -3.3 L-0.6 -1.2 L-2.6 -1.5 Z" />
            </g>
          </svg>
        </div>

        <ol className="journey-rail" aria-label="Journey steps">
          {steps.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === step ? 'step' : undefined}
                className={`${i <= step ? 'is-done' : ''} ${i === step ? 'is-now' : ''}`}
              >
                <b>{year(s.period)}</b>
                <span>{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
