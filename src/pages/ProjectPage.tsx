import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { Tag } from '../components/Tag'
import { findProject, profile, shippedProjects } from '../lib/content'
import { filled } from '../lib/todo'
import { NotFound } from './NotFound'

function Node({ title, detail, primary }: { title: string; detail: string; primary?: boolean }) {
  return (
    <div
      className={`rounded-[14px] border bg-bg p-[18px] transition hover:-translate-y-0.5 hover:border-accent ${
        primary ? 'border-accent' : 'border-line'
      }`}
    >
      <div className="text-[15px] font-semibold">{title}</div>
      <div className="mt-1 text-[13px] leading-normal text-muted">{detail}</div>
    </div>
  )
}

function Edge({ label }: { label: string }) {
  return (
    <div className="flex min-w-[110px] flex-col items-center gap-1 px-3 py-2" aria-hidden>
      <span className="text-[11px] text-muted">{label}</span>
      <div className="h-px w-full bg-accent" />
    </div>
  )
}

export function ProjectPage() {
  const { slug } = useParams()
  const project = findProject(slug)

  useEffect(() => {
    document.title = project ? `${project.title} — ${profile.name}` : `Not found — ${profile.name}`
    return () => {
      document.title = `${profile.name} — ${profile.role}`
    }
  }, [project])

  if (!project) return <NotFound />

  const index = shippedProjects.indexOf(project)
  const next = shippedProjects[(index + 1) % shippedProjects.length]
  const { architecture: arch } = project
  const links = [
    { label: 'Live demo', href: filled(project.links.live) },
    { label: 'Frontend code', href: filled(project.links.frontend) },
    { label: 'Backend code', href: filled(project.links.backend) },
  ].filter((l): l is { label: string; href: string } => !!l.href)

  return (
    <article className="mx-auto max-w-[1120px] px-6 pt-16 pb-24 sm:pt-[72px]">
      <Link to="/#projects" viewTransition className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium">
        <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
        All projects
      </Link>

      <header className="mt-8">
        <div className="text-[13px] font-semibold text-accent">
          {project.category} · {project.role}
        </div>
        <h1
          className="mt-3 text-[clamp(40px,5.5vw,64px)] leading-[1.05] font-bold tracking-[-0.035em]"
          style={{ viewTransitionName: `title-${project.slug}` }}
        >
          {project.title}
        </h1>
        <p className="mt-5 max-w-[60ch] text-[19px] leading-relaxed text-muted">{project.tagline}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-[18px] text-sm font-medium transition hover:-translate-y-0.5 hover:border-accent"
            >
              {l.label}
            </a>
          ))}
          <span aria-hidden className="mx-1 hidden h-6 w-px bg-line sm:block" />
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-[72px]" aria-label="Demo clips">
        {/* Clips are wide screen recordings: the first spans the row so its text stays readable */}
        <div className="grid gap-5 sm:grid-cols-2" style={{ viewTransitionName: `shot-${project.slug}` }}>
          {project.clips.map((clip, i) => (
            <Reveal key={clip.title} index={i} className={i === 0 ? 'sm:col-span-2' : ''}>
              <figure className="overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent">
                {clip.src ? (
                  <video src={clip.src} autoPlay muted loop playsInline className="aspect-[2940/1414] w-full bg-media object-cover" />
                ) : (
                  <div className="flex aspect-[2940/1414] items-center justify-center bg-media text-xs text-muted">
                    Clip coming soon
                  </div>
                )}
                <figcaption className="px-4 py-3.5 text-sm font-medium">{clip.title}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="mt-24">
        <h2 className="text-[28px] font-bold tracking-[-0.02em]">Overview</h2>
        <div
          className="mt-4 max-w-[68ch] space-y-4 text-[17px] leading-[1.75] text-muted [&_a]:text-accent [&_a]:underline [&_strong]:text-fg"
          dangerouslySetInnerHTML={{ __html: project.html }}
        />
      </Reveal>

      <Reveal as="section" className="mt-24">
        <h2 className="text-[28px] font-bold tracking-[-0.02em]">Architecture</h2>
        <p className="mt-3 max-w-[64ch] text-base leading-[1.7] text-muted">{arch.summary}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center rounded-[20px] border border-line bg-surface px-8 py-10">
          <div className="w-[200px]">
            <Node {...arch.client} />
          </div>
          <Edge label={arch.clientLink} />
          <div className="w-[240px]">
            <Node {...arch.server} primary />
          </div>
          <div className="flex flex-col gap-5">
            {arch.services.map((s) => (
              <div key={s.title} className="flex flex-wrap items-center">
                <Edge label={s.link} />
                <div className="w-[190px]">
                  <Node title={s.title} detail={s.detail} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <section className="mt-24">
        <Reveal>
          <h2 className="text-[28px] font-bold tracking-[-0.02em]">Key challenges</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {project.challenges.map((c, i) => (
            <Reveal key={c.title} index={i} className="rounded-2xl border border-line bg-surface p-7">
              <div className="text-[13px] font-semibold text-accent">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="mt-2.5 text-lg font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="mt-24">
        <h2 className="text-[28px] font-bold tracking-[-0.02em]">Limitations &amp; next steps</h2>
        <ul className="mt-6 border-t border-line">
          {project.limitations.map((l) => (
            <li key={l.issue} className="flex flex-wrap gap-4 border-b border-line py-[18px]">
              <span className="flex-[1_1_280px] text-base font-medium">{l.issue}</span>
              <span className="flex-[2_1_360px] text-[15px] leading-relaxed text-muted">{l.next}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {next !== project && (
        <Reveal className="mt-24">
          <Link
            to={`/projects/${next.slug}`}
            viewTransition
            className="group flex items-center justify-between gap-4 rounded-[20px] border border-line bg-surface p-8 transition hover:border-accent"
          >
            <div>
              <div className="text-[13px] text-muted">Next project</div>
              <div className="mt-1.5 text-2xl font-bold tracking-[-0.02em]">{next.title}</div>
            </div>
            <ArrowRight className="size-7 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      )}
    </article>
  )
}
