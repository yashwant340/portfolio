import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { about, profile } from '../lib/content'
import { trackGlow } from '../lib/glow'
import { Beyond } from '../sections/Beyond'
import { Journey } from '../sections/Journey'

// Renders **highlighted** segments in the foreground colour.
function Highlighted({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-medium text-fg">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export function About() {
  useEffect(() => {
    document.title = `About — ${profile.name}`
    return () => {
      document.title = `${profile.name} — ${profile.role}`
    }
  }, [])

  const firstName = profile.name.split(' ')[0]

  return (
    <>
      <section onMouseMove={trackGlow} className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="grid-bg absolute inset-0" />
        <div aria-hidden className="glow absolute inset-0 [--glow-size:520px]" />
        <div className="relative mx-auto max-w-[1120px] px-6 pt-24 pb-24 sm:pt-28">
          <Reveal>
            <div className="text-[13px] font-semibold text-accent">About</div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-4 text-[clamp(36px,5vw,56px)] leading-[1.05] font-bold tracking-[-0.035em]">
              Hi, I'm {firstName}.
            </h1>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-x-16 gap-y-12">
            <div className="flex-[3_1_420px] space-y-5">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={280 + i * 140}>
                  <p className="max-w-[62ch] text-[17px] leading-[1.75] text-muted">
                    <Highlighted text={p} />
                  </p>
                </Reveal>
              ))}
            </div>
            <dl className="flex-[2_1_280px] self-start border-t border-line">
              {about.facts.map((f, i) => (
                <Reveal key={f.label} delay={420 + i * 110} className="border-b border-line py-4">
                  <dt className="text-[13px] text-muted">{f.label}</dt>
                  <dd className="mt-1 text-[15px] font-medium leading-snug">{f.value}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Journey />
      <Beyond />

      <section className="mx-auto max-w-[1120px] px-6 pt-28 pb-28">
        <Reveal className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
          <p className="text-[17px] text-muted">Want to see what I've built, or talk about a role?</p>
          <div className="flex flex-wrap gap-6 text-[15px] font-semibold">
            <Link to="/#projects" className="group inline-flex min-h-11 items-center gap-2 text-fg">
              <span className="link-grow">See my work</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/#contact" className="group inline-flex min-h-11 items-center gap-2 text-accent">
              <span className="link-grow">Get in touch</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
