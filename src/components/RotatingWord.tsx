import { useEffect, useState } from 'react'

// Cycles through words with a quick flip. Screen readers get the full list once
// instead of hearing each change; reduced motion shows only the first word.
export function RotatingWord({ lead, words }: { lead: string; words: string[] }) {
  const [index, setIndex] = useState(0)
  const [turning, setTurning] = useState(false)

  useEffect(() => {
    if (words.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let swap = 0
    const timer = window.setInterval(() => {
      setTurning(true)
      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setTurning(false)
      }, 260)
    }, 2600)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(swap)
    }
  }, [words.length])

  return (
    <p className="flex flex-wrap items-center gap-2.5 text-[21px]">
      <span className="sr-only">
        {lead} {words.join(', ')}
      </span>
      <span aria-hidden>{lead}</span>
      <span
        aria-hidden
        className={`inline-block rounded-lg bg-sage px-3 py-1 font-semibold text-fg transition-transform duration-[450ms] ease-[cubic-bezier(.3,1.4,.5,1)] ${
          turning ? '[transform:rotateX(90deg)]' : ''
        }`}
      >
        {words[index]}
      </span>
    </p>
  )
}
