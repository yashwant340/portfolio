import { useEffect, useRef, useState, type KeyboardEvent, type Ref } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import type { Capability } from '../content/schema'
import { capabilities, shippedProjects } from '../lib/content'

const projectTitle = (ref: string) => shippedProjects.find((p) => p.slug === ref)?.title
const CYCLE_MS = 3500

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const m = matchMedia(query)
    const on = () => setMatches(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return matches
}

// Skills as a spotlight: one skill is lit at a time and a dark panel shows its
// number, tools and where it was proven. On wide screens it steps through the
// list while in view until the visitor hovers, taps or tabs into it. On phones
// the panel opens directly under the tapped skill, and nothing moves on its own.
export function Capabilities() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [visible, setVisible] = useState(false)
  const wide = useMedia('(min-width: 1024px)')
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const listRef = useRef<HTMLOListElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const cycling = auto && wide && visible && !reduce

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Advance on a timer and fill the progress bar in step with it
  useEffect(() => {
    const bar = barRef.current
    if (!cycling) {
      if (bar) bar.style.transform = 'scaleX(1)'
      return
    }
    let start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const p = (now - start) / CYCLE_MS
      if (bar) bar.style.transform = `scaleX(${Math.min(p, 1)})`
      if (p >= 1) {
        start = now
        setActive((i) => (i + 1) % capabilities.length)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [cycling])

  const pick = (i: number) => {
    setAuto(false)
    setActive(i)
  }
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const next = (i + (e.key === 'ArrowDown' ? 1 : capabilities.length - 1)) % capabilities.length
    listRef.current?.querySelectorAll('button')[next]?.focus()
  }

  return (
    <section id="skills" className="mx-auto max-w-[1180px] px-6 pt-28 lg:pt-32">
      <Reveal>
        <h2 className="font-serif text-[clamp(42px,5vw,66px)] leading-none">
          What I can <i className="text-accent">build</i>
        </h2>
        <p className="mt-4 max-w-[56ch] text-base text-muted">
          Capabilities, the tools behind them, and where you can see them working.
        </p>
      </Reveal>

      <Reveal className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_1.05fr]">
        <ol ref={listRef} className="m-0 list-none p-0" onMouseEnter={() => wide && setAuto(false)}>
          {capabilities.map((cap, i) => {
            const on = i === active
            return (
              <li key={cap.title} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={wide ? undefined : on}
                  aria-pressed={wide ? on : undefined}
                  aria-controls={wide ? 'skill-panel' : `skill-panel-${i}`}
                  onClick={() => pick(i)}
                  onMouseEnter={() => wide && pick(i)}
                  onFocus={() => pick(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`flex w-full cursor-pointer items-baseline gap-4 py-3.5 text-left transition-colors duration-300 ${
                    on ? 'text-fg' : 'text-fg/65 hover:text-fg'
                  }`}
                >
                  <span className={`w-6 shrink-0 text-xs font-bold ${on ? 'text-accent' : ''}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`min-w-0 transition-transform duration-300 ease-out-soft ${on ? 'translate-x-2.5' : ''}`}>
                    <span className="block font-serif text-[clamp(26px,2.9vw,38px)] leading-[1.05]">
                      {on && <span aria-hidden className="mr-3 inline-block h-[3px] w-[22px] rounded-sm bg-accent align-middle" />}
                      {cap.title}
                    </span>
                    <span className="mt-1 hidden text-xs font-semibold tracking-[0.06em] uppercase lg:block">
                      {cap.usedIn.map((r) => projectTitle(r) ?? r).join(' · ')}
                    </span>
                  </span>
                </button>
                {!wide && on && (
                  <div className="pb-4">
                    <Panel cap={cap} id={`skill-panel-${i}`} />
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        {wide && (
          <div className="sticky top-24">
            <Panel cap={capabilities[active]} id="skill-panel" barRef={barRef} showBar />
          </div>
        )}
      </Reveal>
    </section>
  )
}

function Panel({
  cap,
  id,
  barRef,
  showBar,
}: {
  cap: Capability
  id: string
  barRef?: Ref<HTMLSpanElement>
  showBar?: boolean
}) {
  return (
    <div
      id={id}
      aria-live="polite"
      className="relative flex flex-col gap-4 overflow-hidden rounded-[28px] bg-feature p-6 text-feature-fg shadow-[0_50px_80px_-50px_rgba(43,30,26,0.6)] sm:p-9 lg:min-h-[440px] lg:rounded-[32px] lg:p-10"
    >
      <span aria-hidden className="pointer-events-none absolute -right-24 -bottom-24 size-56 rounded-full bg-sage opacity-30" />
      {showBar && (
        <span aria-hidden className="block h-[3px] overflow-hidden rounded-sm bg-current/15">
          <span ref={barRef} className="block h-full origin-left bg-feature-accent" style={{ transform: 'scaleX(1)' }} />
        </span>
      )}
      <div key={cap.title} className="relative z-[1] flex animate-[panel-in_.35s_var(--ease-out-soft)] flex-col gap-4">
        <div className="text-xs font-bold tracking-[0.14em] uppercase opacity-70">
          {cap.usedIn.map((r) => projectTitle(r) ?? r).join(' · ')}
        </div>
        {cap.stat && (
          <div>
            <div className="font-serif text-[clamp(52px,6.5vw,96px)] leading-[0.9] text-feature-accent">{cap.stat.value}</div>
            <div className="mt-2 text-sm opacity-75">{cap.stat.label}</div>
          </div>
        )}
        <h3 className="font-serif text-[clamp(26px,2.6vw,34px)] leading-tight font-normal">{cap.title}</h3>
        <p className="max-w-[46ch] leading-relaxed opacity-85">{cap.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {cap.tools.map((t) => (
            <span key={t} className="rounded-full bg-current/10 px-2.5 py-1 text-xs">
              {t}
            </span>
          ))}
        </div>
        <div className="relative z-[1] mt-2 flex flex-wrap gap-2">
          {cap.usedIn.map((ref) => {
            const title = projectTitle(ref)
            return title ? (
              <Link
                key={ref}
                to={`/projects/${ref}`}
                viewTransition
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-sage px-4 text-[13px] font-bold text-fg"
              >
                See {title} <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <span key={ref} className="inline-flex min-h-10 items-center rounded-full border border-current/30 px-4 text-[13px] font-semibold">
                At {ref}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
