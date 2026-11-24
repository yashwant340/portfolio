import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ShippedProject } from '../content/schema'
import { profile, type ShippedWithHtml } from '../lib/content'
import { decadeAbove, fmt, logPos } from '../lib/latency'
import { filled } from '../lib/todo'
import { ArchMap } from './ArchMap'
import { ClipPlayer } from './ClipPlayer'
import { Highlight } from './Highlight'
import { ArrowRight, Download } from './Icons'
import { Reveal } from './Reveal'

type Chapter = NonNullable<ShippedProject['story']>[number]

const typeLabel: Record<Chapter['type'], string> = {
  overview: 'Overview',
  built: 'What I built',
  architecture: 'Architecture',
  decision: 'My decision',
  decisions: 'Key decisions',
  latency: 'Speed',
  failures: 'Results',
}

const num = (i: number) => String(i + 1).padStart(2, '0')

// A project told as a story: a pinned panel shows one big number for the chapter
// being read, while the chapters scroll beside it (below a compact strip on phones).
export function ProjectStory({ project, featured, next }: { project: ShippedWithHtml; featured: boolean; next?: ShippedWithHtml }) {
  const story = project.story ?? []
  const chapters = useRef<(HTMLElement | null)[]>([])
  const [active, setActive] = useState(0)
  const code = filled(project.links.code)
  const repos = [
    { label: 'Frontend code', href: filled(project.links.frontend) },
    { label: 'Backend code', href: filled(project.links.backend) },
  ].filter((l): l is { label: string; href: string } => !!l.href)
  const email = filled(profile.links.email)

  // The chapter whose top has passed 55% of the screen height is the one being read
  useEffect(() => {
    const update = () => {
      let on = 0
      chapters.current.forEach((c, i) => {
        if (c && c.getBoundingClientRect().top < innerHeight * 0.55) on = i
      })
      setActive(on)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [])

  const jump = (i: number) =>
    chapters.current[i]?.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    })

  const current = story[active] ?? story[0]

  return (
    <article className="pb-24">
      <header className="mx-auto max-w-[1180px] px-6 pt-14 pb-10 text-center sm:pt-[70px]">
        <Reveal className="text-sm text-muted">
          <Link to="/#projects" viewTransition className="underline underline-offset-4">
            Work
          </Link>{' '}
          / {project.title}
        </Reveal>
        <Reveal index={1} className="mt-7 text-xs font-bold tracking-[0.16em] text-accent uppercase">
          {featured && '★ Featured · '}
          {project.category}
        </Reveal>
        <Reveal index={2}>
          <h1
            className="mt-3 font-serif text-[clamp(64px,9vw,128px)] leading-[0.9] font-normal"
            style={{ viewTransitionName: `title-${project.slug}` }}
          >
            {project.title}
          </h1>
        </Reveal>
        <Reveal index={3}>
          <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-muted sm:text-xl">{project.tagline}</p>
        </Reveal>
        <Reveal index={4} className="mt-6 flex flex-wrap justify-center gap-2">
          {project.stack.map((s) => (
            <span key={s} className="rounded-full border border-line px-3 py-1 text-xs">
              {s}
            </span>
          ))}
        </Reveal>
        <Reveal index={5} className="mt-7 flex flex-wrap justify-center gap-3">
          {code && (
            <a href={code} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-full bg-accent px-[22px] text-[15px] font-semibold text-accent-fg transition hover:-translate-y-0.5">
              View code
            </a>
          )}
          {repos.map((r) => (
            <a key={r.label} href={r.href} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-full border-[1.5px] border-fg/30 px-[22px] text-[15px] font-semibold">
              {r.label}
            </a>
          ))}
          <a href="#story" className="inline-flex h-12 items-center rounded-full border-[1.5px] border-fg/30 px-[22px] text-[15px] font-semibold">
            Read the story ↓
          </a>
        </Reveal>
        {project.note && <p className="mx-auto mt-4 max-w-[60ch] text-sm text-muted">{project.note}</p>}
      </header>

      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <ClipPlayer project={project} />
        </Reveal>

        <div id="story" className="story-grid scroll-mt-20">
          <div className={`story-stage ${current.mine ? 'is-mine' : ''}`} aria-hidden>
            <span className="story-badge">My part</span>
            <div key={active} className="story-stage-text">
              <div className="story-kicker">
                {num(active)} · {typeLabel[current.type]}
              </div>
              <div className="story-num font-serif">{current.stat.value}</div>
              <div className="story-cap">{current.stat.label}</div>
            </div>
            <div className="story-dots">
              {story.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  tabIndex={-1}
                  onClick={() => jump(i)}
                  className={`${i <= active ? 'is-on' : ''} ${c.mine ? 'is-mine' : ''}`}
                />
              ))}
            </div>
          </div>

          <div>
            {story.map((c, i) => (
              <section
                key={i}
                ref={(el) => {
                  chapters.current[i] = el
                }}
                className={`story-chapter ${i === active ? 'is-on' : ''}`}
                aria-labelledby={`chapter-${i}`}
              >
                <div className="text-xs font-bold tracking-[0.16em] text-accent uppercase">
                  {num(i)} · {typeLabel[c.type]}
                  {c.mine && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 tracking-[0.08em] text-accent-fg">Mine</span>}
                </div>
                <h2 id={`chapter-${i}`} className="mt-3 font-serif text-[clamp(38px,4vw,56px)] leading-none font-normal">
                  <Highlight text={c.heading} />
                </h2>
                {/* The big number for screen readers, since the pinned panel is decorative */}
                <p className="sr-only">
                  {c.stat.value} {c.stat.label}
                </p>
                <div className="mt-5">
                  <ChapterBody chapter={c} project={project} />
                </div>
              </section>
            ))}
          </div>
        </div>

        <Reveal as="section" className="mt-10 rounded-[32px] bg-feature px-7 py-14 text-center text-feature-fg sm:py-16">
          <h2 className="font-serif text-[clamp(40px,5vw,64px)] leading-none font-normal">
            <Highlight text={profile.projectCta.heading} className="text-feature-accent" />
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] leading-relaxed opacity-80">{profile.contact.text}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {email && (
              <a href={`mailto:${email}`} className="inline-flex h-12 items-center rounded-full bg-feature-accent px-[22px] text-[15px] font-semibold text-feature">
                {profile.contact.button}
              </a>
            )}
            <a href={profile.links.cv} download className="inline-flex h-12 items-center gap-2 rounded-full border-[1.5px] border-current/35 px-[22px] text-[15px] font-semibold">
              <Download className="size-4" /> Download CV
            </a>
          </div>
        </Reveal>

        {next && next !== project && (
          <Reveal className="mt-5">
            <Link
              to={`/projects/${next.slug}`}
              viewTransition
              className="flex flex-wrap items-center justify-between gap-5 rounded-[30px] bg-sage p-8 transition hover:-translate-y-1.5 sm:p-11"
            >
              <div>
                <div className="text-xs font-bold tracking-[0.16em] uppercase">Next project</div>
                <div className="mt-2 flex items-center gap-3 font-serif text-[clamp(40px,5vw,64px)] leading-none">
                  {next.title} <ArrowRight className="size-8" />
                </div>
              </div>
              <span className="max-w-[30ch] text-[15px]">{next.summary}</span>
            </Link>
          </Reveal>
        )}
      </div>
    </article>
  )
}

function ChapterBody({ chapter: c, project }: { chapter: Chapter; project: ShippedWithHtml }) {
  const prose = 'max-w-[46ch] text-[17px] leading-[1.65] text-muted'
  switch (c.type) {
    case 'overview': {
      const first = project.html.split('</p>')[0] + '</p>'
      return <div className={`${prose} [&_strong]:text-fg`} dangerouslySetInnerHTML={{ __html: first }} />
    }
    case 'built':
      return (
        <ul className="m-0 max-w-[48ch] list-none border-t-2 border-fg p-0">
          {(c.items ?? []).map((it, i) => (
            <li key={it.title} className="grid grid-cols-[44px_1fr] gap-3 border-b border-line py-4">
              <span className="font-serif text-[30px] leading-none text-accent">{i + 1}</span>
              <div>
                <b className="block text-[17px]">{it.title}</b>
                <span className="text-sm leading-normal text-muted">{it.body}</span>
              </div>
            </li>
          ))}
        </ul>
      )
    case 'architecture':
      return (
        <>
          <p className={prose}>{project.architecture.summary}</p>
          {project.diagram && <ArchMap diagram={project.diagram} />}
        </>
      )
    case 'decision':
    case 'decisions': {
      const picked = (c.decisions ?? []).map((i) => project.decisions?.[i]).filter((d) => !!d)
      if (c.type === 'decision')
        return (
          <>
            {picked.map((d) => (
              <div key={d.title}>
                <h3 className="text-lg font-semibold">{d.title}</h3>
                <p className={`${prose} mt-2`}>{d.body}</p>
                {d.tradeoff && (
                  <p className="mt-4 max-w-[46ch] rounded-[18px] bg-feature px-5 py-4 text-[15px] leading-normal text-feature-fg">
                    <b className="text-feature-accent">Trade-off:</b> {d.tradeoff}
                  </p>
                )}
              </div>
            ))}
          </>
        )
      return (
        <div className="max-w-[48ch]">
          {picked.map((d) => (
            <div key={d.title} className="border-b border-line py-4">
              <b className="block text-[17px]">{d.title}</b>
              <span className="mt-1 block text-sm leading-normal text-muted">{d.body}</span>
              {d.tradeoff && (
                <span className="mt-2 block text-sm">
                  <b>Trade-off:</b> {d.tradeoff}
                </span>
              )}
            </div>
          ))}
        </div>
      )
    }
    case 'latency': {
      const latency = project.results?.latency
      if (!latency) return null
      const max = decadeAbove(Math.max(...latency.rows.map((r) => r.p50)))
      return (
        <div className="max-w-[48ch]">
          {latency.rows.map((r) => {
            const mine = r.label === c.highlight
            return (
              <div key={r.label} className={`grid grid-cols-[1fr_74px] items-center gap-x-3 gap-y-1.5 py-1.5 text-sm sm:grid-cols-[150px_1fr_74px] ${mine ? 'font-bold' : ''}`}>
                <span>
                  {r.label}
                  {mine && <span className="ml-2 rounded-full bg-accent px-1.5 py-px text-xs text-accent-fg">Mine</span>}
                </span>
                <span className="relative col-span-2 row-start-2 h-2.5 rounded-full bg-fg/10 sm:col-span-1 sm:row-start-auto">
                  <span
                    className={`absolute inset-y-0 left-0 rounded-full ${mine ? 'bg-accent' : 'bg-fg/35'}`}
                    style={{ width: `${Math.max(logPos(r.p50, max), 3)}%` }}
                  />
                </span>
                <span className="text-right tabular-nums sm:row-start-auto">{fmt(r.p50)} ms</span>
              </div>
            )
          })}
          <p className="mt-3 text-[13px] text-muted">
            p50, log scale.{latency.note ? ` ${latency.note}` : ''}
          </p>
        </div>
      )
    }
    case 'failures': {
      const failures = project.results?.failures ?? []
      return (
        <ul className="m-0 max-w-[48ch] list-none p-0">
          {failures.map((f) => (
            <li key={f.failure} className="flex justify-between gap-4 border-b border-line py-3 text-[15px]">
              <span>
                {f.failure}
                {f.failure === c.highlight && (
                  <span className="ml-2 rounded-full bg-accent px-1.5 py-px text-xs font-bold text-accent-fg">Mine</span>
                )}
              </span>
              <span className="text-right font-semibold">
                <span aria-hidden className="text-accent">✓ </span>
                {f.outcome}
              </span>
            </li>
          ))}
        </ul>
      )
    }
  }
}
