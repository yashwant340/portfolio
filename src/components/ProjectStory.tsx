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
  feature: 'Feature',
}

const labelOf = (c: Chapter) => c.label ?? typeLabel[c.type]

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
  const key = project.keyDecision !== undefined ? project.decisions?.[project.keyDecision] : undefined

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

        {/* The decision that frames the whole project, read before the story */}
        {key && (
          <Reveal as="section" className="mt-16 rounded-[32px] bg-feature px-7 py-10 text-feature-fg sm:px-12 sm:py-12" aria-labelledby="key-decision">
            <div className="text-xs font-bold tracking-[0.16em] text-feature-accent uppercase">The big decision</div>
            <h2 id="key-decision" className="mt-3 font-serif text-[clamp(36px,4.4vw,56px)] leading-none font-normal">
              {key.title}
            </h2>
            <div className={`mt-7 grid gap-7 md:gap-12 ${key.tradeoff ? 'md:grid-cols-[1.5fr_1fr]' : ''}`}>
              <p className={`text-[17px] leading-[1.7] opacity-90 ${key.tradeoff ? '' : 'max-w-[70ch] md:text-[19px]'}`}>{key.body}</p>
              {key.tradeoff && (
                <p className="border-t border-current/20 pt-5 text-[15px] leading-relaxed md:border-t-0 md:border-l md:pt-0 md:pl-8">
                  <b className="mb-1.5 block text-xs tracking-[0.14em] text-feature-accent uppercase">Trade-off</b>
                  {key.tradeoff}
                </p>
              )}
            </div>
          </Reveal>
        )}

        <div id="story" className="story-grid scroll-mt-20">
          {/* Chapter rail (large screens): a labelled jump target for every chapter */}
          <nav className="story-rail" aria-label="Chapters">
            {story.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => jump(i)}
                aria-current={i === active ? 'step' : undefined}
                className={`${i === active ? 'is-on' : ''} ${i < active ? 'is-done' : ''}`}
              >
                <span className="story-rail-num">{num(i)}</span>
                {labelOf(c)}
              </button>
            ))}
          </nav>

          <div className={`story-stage ${current.mine ? 'is-mine' : ''}`}>
            <span className="story-badge" aria-hidden>
              My part
            </span>
            <div key={active} className="story-stage-text">
              <div className="story-kicker" aria-hidden>
                {num(active)} · {labelOf(current)}
              </div>
              {/* No honest number for this chapter: its name stands in */}
              <div className={`story-num font-serif ${(current.stat?.value ?? labelOf(current)).length > 6 ? 'is-long' : ''}`} aria-hidden>
                {current.stat?.value ?? labelOf(current)}
              </div>
              {current.stat && (
                <div className="story-cap" aria-hidden>
                  {current.stat.label}
                </div>
              )}
            </div>
            <div className="story-dots" aria-hidden>
              {story.map((c, i) => (
                <span key={i} className={`${i <= active ? 'is-on' : ''} ${c.mine ? 'is-mine' : ''}`} />
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
                  {num(i)} · {labelOf(c)}
                  {c.mine && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 tracking-[0.08em] text-accent-fg">Mine</span>}
                </div>
                <h2 id={`chapter-${i}`} className="mt-3 font-serif text-[clamp(38px,4vw,56px)] leading-none font-normal">
                  <Highlight text={c.heading} />
                </h2>
                {/* The big number for screen readers, since the pinned panel is decorative */}
                {c.stat && (
                  <p className="sr-only">
                    {c.stat.value} {c.stat.label}
                  </p>
                )}
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
              <a href={`mailto:${email}`} data-magnetic className="inline-flex h-12 items-center rounded-full bg-feature-accent px-[22px] text-[15px] font-semibold text-feature">
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
              data-cursor="View"
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
          {project.diagram ? <ArchMap diagram={project.diagram} /> : <SimpleArch project={project} />}
          {(c.decisions ?? []).map((i) => project.decisions?.[i]).filter((d) => !!d).map((d) => (
            <Decision key={d.title} title={d.title} body={d.body} tradeoff={d.tradeoff} />
          ))}
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
    case 'feature': {
      const parts = project.html.split('</p>')
      const paragraph =
        c.paragraph === undefined ? undefined : [c.paragraph].flat().map((i) => (parts[i] ?? '') + '</p>').join('')
      const challenge = c.challenge !== undefined ? project.challenges?.[c.challenge] : undefined
      const decisions = (c.decisions ?? []).map((i) => project.decisions?.[i]).filter((d) => !!d)
      const limits = (c.limits ?? []).map((i) => project.limitations?.[i]).filter((l) => !!l)
      return (
        <div className="max-w-[48ch]">
          {paragraph && <div className={`${prose} space-y-4 [&_strong]:text-fg`} dangerouslySetInnerHTML={{ __html: paragraph }} />}
          {challenge && (
            <div className={paragraph ? 'mt-6' : ''}>
              <div className="text-xs font-bold tracking-[0.14em] text-muted uppercase">The hard part · {challenge.title}</div>
              <p className={`${prose} mt-2`}>{challenge.body}</p>
            </div>
          )}
          {decisions.map((d) => (
            <Decision key={d.title} title={d.title} body={d.body} tradeoff={d.tradeoff} />
          ))}
          {limits.length > 0 && (
            <div className="mt-7">
              <div className="text-xs font-bold tracking-[0.14em] text-muted uppercase">Next step</div>
              <ul className="m-0 mt-2 list-none p-0">
                {limits.map((l) => (
                  <li key={l.issue} className="grid grid-cols-[20px_1fr] gap-2 border-b border-line py-3 text-sm leading-normal">
                    <span aria-hidden className="text-accent">→</span>
                    <span>
                      <b className="font-semibold">{l.issue}.</b> <span className="text-muted">{l.next}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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

// A decision inside a chapter: a soft sage card, so it stands apart from the prose around it
function Decision({ title, body, tradeoff }: { title: string; body: string; tradeoff?: string }) {
  return (
    <div className="mt-6 max-w-[48ch] rounded-[22px] bg-sage-soft px-5 py-4">
      <div className="text-xs font-bold tracking-[0.14em] uppercase">My decision</div>
      <b className="mt-1.5 block text-[17px] leading-snug">{title}</b>
      <p className="mt-1.5 text-[15px] leading-relaxed">{body}</p>
      {tradeoff && (
        <p className="mt-2 text-[15px] leading-relaxed">
          <b>Trade-off:</b> {tradeoff}
        </p>
      )}
    </div>
  )
}

function ArchBox({ title, detail, strong }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`rounded-2xl px-4 py-3 ${strong ? 'bg-feature text-feature-fg' : 'border-[1.5px] border-line bg-bg'}`}>
      <b className="block text-[15px]">{title}</b>
      <span className={`text-[13px] leading-snug ${strong ? 'opacity-80' : 'text-muted'}`}>{detail}</span>
    </div>
  )
}

function ArchLink({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5 pl-5 text-xs text-muted">
      <span aria-hidden className="h-4 w-px bg-fg/30" /> {label}
    </div>
  )
}

// The architecture as a short stacked flow, for projects without a drawn map
function SimpleArch({ project }: { project: ShippedWithHtml }) {
  const a = project.architecture
  return (
    <div className="mt-6 max-w-[48ch]">
      <ArchBox {...a.client} />
      <ArchLink label={a.clientLink} />
      <ArchBox {...a.server} strong />
      <div className="grid gap-x-3 sm:grid-cols-2">
        {a.services.map((sv) => (
          <div key={sv.title}>
            <ArchLink label={sv.link} />
            <ArchBox title={sv.title} detail={sv.detail} />
          </div>
        ))}
      </div>
    </div>
  )
}
