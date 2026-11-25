import { useEffect, useRef } from 'react'

// A silent looping clip that only plays while on screen and not paused,
// with its own Pause / Play button (shared `paused` state across a page).
export function LoopVideo({
  src,
  title,
  paused,
  onToggle,
  className = '',
}: {
  src: string
  title: string
  paused: boolean
  onToggle: () => void
  className?: string
}) {
  const video = useRef<HTMLVideoElement>(null)
  const onScreen = useRef(false)

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (paused || !onScreen.current) v.pause()
    else v.play().catch(() => {})
  }, [paused, src])

  useEffect(() => {
    const v = video.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      onScreen.current = e.isIntersecting
      if (e.isIntersecting && !paused) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [paused])

  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-black shadow-[0_30px_50px_-30px_rgba(43,30,26,0.6)] ${className}`}>
      <video ref={video} src={src} muted loop playsInline aria-label={title} className="block aspect-[2940/1414] w-full object-contain" />
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={paused}
        className="absolute right-3 bottom-2.5 inline-flex min-h-9 cursor-pointer items-center rounded-full border-[1.5px] border-[#f7f1e6]/40 bg-[#2b1e1a]/80 px-3.5 text-xs font-semibold text-[#f7f1e6]"
      >
        {paused ? 'Play' : 'Pause'}
      </button>
    </div>
  )
}
