import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Highlight } from '../components/Highlight'
import { ArrowRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { about, profile } from '../lib/content'
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
    document.title = `About ${profile.name}`
    return () => {
      document.title = `${profile.name}, ${profile.role.toLowerCase()}`
    }
  }, [])

  const firstName = profile.name.split(' ')[0]

  return (
    <>
      <section className="hero-sunset overflow-hidden">
        <div className="relative mx-auto max-w-[1180px] px-6 pt-20 pb-24 sm:pt-24">
          <Reveal>
            <div className="text-xs font-bold tracking-[0.16em] text-accent uppercase">About</div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-4 font-serif text-[clamp(54px,6.6vw,96px)] leading-[0.95] font-normal">
              <Highlight text={`Hi, I'm **${firstName}.**`} />
            </h1>
          </Reveal>
          <div className="mt-10 flex flex-wrap items-start gap-x-16 gap-y-12">
            <div className="flex-[3_1_420px] space-y-5">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={280 + i * 140}>
                  <p className="max-w-[62ch] text-[17px] leading-[1.75] text-muted">
                    <Highlighted text={p} />
                  </p>
                </Reveal>
              ))}
            </div>
            {/* Quick facts on the dark surface the site uses for "look here first" */}
            <Reveal delay={420} className="flex-[2_1_300px] self-start">
              <dl className="rounded-[28px] bg-feature p-6 text-feature-fg shadow-[0_50px_80px_-50px_rgba(43,30,26,0.6)] sm:p-8">
                <div className="mb-2 text-xs font-bold tracking-[0.16em] text-feature-accent uppercase">Quick facts</div>
                {about.facts.map((f) => (
                  <div key={f.label} className="border-b border-current/15 py-3.5 last:border-b-0">
                    <dt className="text-[13px] opacity-70">{f.label}</dt>
                    <dd className="mt-1 text-[15px] leading-snug font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <Journey />
      <Beyond />

      <section className="mx-auto max-w-[1180px] px-6 pt-24 pb-24">
        <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-[32px] bg-feature px-7 py-10 text-feature-fg sm:px-11 sm:py-12">
          <p className="max-w-[30ch] font-serif text-[clamp(28px,3vw,40px)] leading-tight">Want to see what I've built, or talk about a role?</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/#projects"
              data-magnetic
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-feature-accent px-[22px] text-[15px] font-semibold text-feature"
            >
              See my work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/#contact"
              className="group inline-flex h-12 items-center gap-2 rounded-full border-[1.5px] border-current/35 px-[22px] text-[15px] font-semibold"
            >
              Get in touch
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
