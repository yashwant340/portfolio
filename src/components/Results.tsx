import { useEffect, useRef } from 'react'
import type { ShippedProject } from '../content/schema'
import { Reveal } from './Reveal'
import { decadeAbove, fmt, logPos } from '../lib/latency'

type ResultsData = NonNullable<ShippedProject['results']>

// Counts the leading number of a value like "246 ms" or "1,189" up from zero the
// first time it scrolls into view. Writes to the DOM directly, so it never re-renders,
// and the final value is what's in the HTML if JS or motion is off.
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const match = value.match(/^([\d,]+(?:\.\d+)?)(.*)$/)
    if (!el || !match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = Number(match[1].replace(/,/g, ''))
    if (!target || !('IntersectionObserver' in window)) return
    const decimals = match[1].split('.')[1]?.length ?? 0
    const format = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + match[2]

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1200, 1)
          el.textContent = format(target * (1 - Math.pow(1 - t, 3)))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return <span ref={ref}>{value}</span>
}


export function Results({ results }: { results: ResultsData }) {
  const { stats, latency, failures, intro } = results
  const max = latency ? decadeAbove(Math.max(...latency.rows.map((r) => r.p99))) : 0
  const ticks = [1, 10, 100, 1000].filter((t) => t <= max)

  return (
    <section className="mt-24">
      <Reveal>
        <h2 className="font-serif text-[clamp(34px,3.6vw,44px)] leading-none font-normal">Results</h2>
        {intro && <p className="mt-3 max-w-[60ch] text-[15px] text-muted">{intro}</p>}
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} index={i} className="rounded-2xl border border-line bg-surface p-6">
            <div className="text-[clamp(26px,4vw,44px)] leading-none font-bold tracking-[-0.03em] whitespace-nowrap text-accent tabular-nums">
              <CountUp value={s.value} />
            </div>
            <p className="mt-3 text-sm leading-snug text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {latency && (
          <Reveal className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
            <h3 className="text-lg font-semibold tracking-tight">Where the time goes</h3>
            <div className="mt-2 flex gap-5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-accent" />
                p50
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-0.5 bg-fg" />
                p99
              </span>
              <span>ms, log scale</span>
            </div>

            <ul className="mt-5 flex flex-col gap-4">
              {latency.rows.map((r, i) => (
                <li
                  key={r.label}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-sm sm:grid-cols-[140px_1fr_88px]"
                  title={`${r.label}: p50 ${fmt(r.p50)} ms, p99 ${fmt(r.p99)} ms`}
                >
                  <span className="text-muted">{r.label}</span>
                  <span className="relative col-span-2 row-start-2 h-3 sm:col-span-1 sm:row-start-auto">
                    <span className="absolute inset-y-0 left-0 w-full rounded-full bg-line/60" />
                    <span
                      className="grow-bar absolute inset-y-0 left-0 rounded-r-[4px] bg-accent"
                      style={{ width: `${Math.max(logPos(r.p50, max), 1)}%`, ['--bar-delay' as string]: `${i * 120}ms` }}
                    />
                    <span
                      className="absolute -top-1 -bottom-1 w-0.5 bg-fg"
                      style={{ left: `${logPos(r.p99, max)}%` }}
                    />
                  </span>
                  <span className="text-right font-medium tabular-nums">
                    {fmt(r.p50)} <span className="text-muted">/ {fmt(r.p99)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="relative mt-3 h-4 text-[11px] text-muted sm:ml-[152px] sm:mr-[100px]">
              {ticks.map((t) => (
                <span key={t} className="absolute -translate-x-1/2" style={{ left: `${logPos(t, max)}%` }}>
                  {t}
                </span>
              ))}
            </div>
            {latency.note && <p className="mt-5 text-[13px] leading-relaxed text-muted">{latency.note}</p>}
          </Reveal>
        )}

        {failures && (
          <Reveal index={1} className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
            <h3 className="text-lg font-semibold tracking-tight">We broke it on purpose</h3>
            <ul className="mt-4">
              {failures.map((f) => (
                <li key={f.failure} className="flex flex-col gap-1 border-t border-line py-3.5 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="text-sm text-muted">{f.failure}</span>
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {f.outcome}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  )
}
