import { useEffect, useRef, useState } from 'react'
import type { ShippedProject } from '../content/schema'
import { Play } from './Icons'

type Item = { title: string; src?: string; label: string }

// One player for all of a project's media: the silent preview loop first (if any),
// then each clip as a tab. Nothing plays until it has a real file; a clip pauses
// when the player scrolls off screen, and the visitor can pause it.
export function ClipPlayer({ project }: { project: ShippedProject }) {
  const items: Item[] = [
    ...(project.preview ? [{ title: 'Preview', src: project.preview, label: 'Preview' }] : []),
    ...project.clips.map((c, i) => ({ title: c.title, src: c.src, label: String(i + 1) })),
  ]
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const video = useRef<HTMLVideoElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const onScreen = useRef(true)
  const item = items[active]

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (paused || !onScreen.current) v.pause()
    else v.play().catch(() => {})
  }, [paused, active])

  useEffect(() => {
    const el = frame.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      onScreen.current = e.isIntersecting
      const v = video.current
      if (!v) return
      if (e.isIntersecting && !paused) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [paused])

  return (
    <div>
      <div
        ref={frame}
        className="relative overflow-hidden rounded-[28px] bg-[#2b1e1a] text-[#f7f1e6] shadow-[0_60px_80px_-50px_rgba(43,30,26,0.65)]"
        style={{ viewTransitionName: `shot-${project.slug}` }}
      >
        {item.src ? (
          <video
            key={item.src}
            ref={video}
            src={item.src}
            muted
            loop
            playsInline
            autoPlay={!paused}
            aria-label={item.title}
            className="block aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 px-6 text-center sm:aspect-[16/8]">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#b34a1b] pl-1 sm:size-[78px]">
              <Play className="size-7" />
            </span>
            <span className="text-[15px] font-medium">{item.title}</span>
            <span className="text-xs opacity-70">Clip coming soon</span>
          </div>
        )}
        {item.src && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="absolute right-4 bottom-3.5 inline-flex min-h-9 cursor-pointer items-center rounded-full border-[1.5px] border-[#f7f1e6]/40 bg-[#2b1e1a]/80 px-3.5 text-xs font-semibold"
          >
            {paused ? 'Play' : 'Pause'}
          </button>
        )}
      </div>

      {items.length > 1 && (
        <div role="tablist" aria-label="Clips" className="mt-3.5 grid grid-cols-2 gap-2 sm:flex">
          {items.map((it, i) => (
            <button
              key={it.title}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`min-h-11 flex-1 cursor-pointer rounded-2xl border-[1.5px] px-4 py-3 text-left text-sm leading-snug transition hover:-translate-y-0.5 ${
                i === active ? 'border-feature bg-feature text-feature-fg' : 'border-line hover:border-fg'
              }`}
            >
              <b className={`mr-1.5 ${i === active ? 'text-feature-accent' : 'text-accent'}`}>{it.label}</b>
              {it.label !== it.title && it.title}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
