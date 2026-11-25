import type React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { LiveSoon } from '../components/LiveSoon'
import { Reveal } from '../components/Reveal'
import { Shot } from '../components/Shot'
import { Tag } from '../components/Tag'
import type { InProgressProject } from '../content/schema'
import { profile, projects, shippedProjects, type ShippedWithHtml } from '../lib/content'
import { filled } from '../lib/todo'

const num = (i: number) => String(i + 1).padStart(2, '0')
// Clicking anywhere on a card opens its project, through the card's main link so the
// paint wipe and keyboard behaviour stay the same; links and buttons inside keep their own action.
const openCard = (e: React.MouseEvent<HTMLElement>) => {
  if ((e.target as Element).closest('a, button')) return
  e.currentTarget.querySelector<HTMLAnchorElement>('a[data-primary]')?.click()
}
const cardProps = { onClick: openCard, 'data-cursor': 'View' }

const hoverLift = 'transition duration-500 ease-out-soft hover:-translate-y-1.5 motion-reduce:hover:translate-y-0'

// Importance reads from contrast and size: the first project is the dark featured
// card, the second a wide sage card, the third a smaller light card.
export function Projects() {
  const upcoming = projects.filter((p): p is InProgressProject & { html: string } => p.status === 'in-progress')
  const section = profile.projectsSection
  const [featured, second, ...rest] = shippedProjects

  return (
    <section id="projects" className="mx-auto max-w-[1180px] px-6 pt-24 lg:pt-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-serif text-[clamp(42px,5vw,66px)] leading-none">{section.heading}</h2>
        <span className="text-sm text-muted">
          {shippedProjects.length} {section.builtLabel}
          {upcoming.length > 0 && ` · ${upcoming.length} ${section.inProgressLabel}`}
        </span>
      </Reveal>

      {featured && <Featured project={featured} />}

      {(second || rest.length > 0) && (
        <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
          {second && <Second project={second} />}
          {rest.map((p, i) => (
            <Third key={p.slug} project={p} index={i + 2} />
          ))}
        </div>
      )}

      {upcoming.map((p) => (
        <Reveal
          key={p.slug}
          className="mt-16 flex flex-col-reverse items-start gap-4 rounded-[20px] border border-dashed border-line px-6 py-7 sm:flex-row sm:justify-between sm:gap-5 sm:px-8"
        >
          <div className="flex min-w-0 flex-1 gap-5">
            <span className="mt-1.5 text-[13px] font-semibold text-accent">{String(p.order).padStart(2, '0')}</span>
            <div className="min-w-0">
              <div className="text-xl font-semibold tracking-tight">{p.title}</div>
              {p.role && <div className="mt-1 text-[13px] font-semibold text-accent">{p.role}</div>}
              <div className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted">{p.summary}</div>
              {p.services && (
                <div className="mt-3 text-[13px] text-muted">
                  <span className="font-semibold text-fg">Services</span> · {p.services.join(' · ')}
                </div>
              )}
              {p.stack && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              )}
            </div>
          </div>
          <span className="self-start rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold">In progress</span>
        </Reveal>
      ))}
    </section>
  )
}

function Title({ project, className }: { project: ShippedWithHtml; className: string }) {
  return (
    <h3 className={`font-serif leading-[0.95] font-normal ${className}`} style={{ viewTransitionName: `title-${project.slug}` }}>
      {project.title}
    </h3>
  )
}

function CaseLink({ project, label = 'View case study' }: { project: ShippedWithHtml; label?: string }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      viewTransition
      data-primary
      className="group/cta inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold underline underline-offset-4"
    >
      {label}
      <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-1" />
    </Link>
  )
}

function Featured({ project: p }: { project: ShippedWithHtml }) {
  const code = filled(p.links.code)
  return (
    <Reveal
      as="article"
      {...cardProps}
      className="mt-10 grid cursor-pointer items-center gap-8 rounded-[32px] bg-feature p-6 text-feature-fg shadow-[0_50px_80px_-50px_rgba(43,30,26,0.6)] sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-11"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.14em] uppercase">
          <span className="rounded-full bg-feature-accent px-3 py-1 text-feature tracking-[0.06em]">★ Featured · {num(0)}</span>
          <span className="opacity-70">{p.category}</span>
        </div>
        <Title project={p} className="mt-5 text-[clamp(48px,5.4vw,76px)]" />
        <p className="mt-4 max-w-[44ch] text-[17px] leading-relaxed opacity-80">{p.summary}</p>

        {p.proof && (
          <dl className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-3">
            {p.proof.map((s) => (
              <div key={s.label} className="grid grid-cols-[minmax(88px,auto)_1fr] items-baseline gap-3 sm:block">
                <dt
                  className={`font-serif leading-none whitespace-nowrap text-feature-accent ${
                    s.value.length > 6 ? 'text-[clamp(26px,2.3vw,34px)]' : 'text-[clamp(32px,3.4vw,44px)]'
                  }`}
                >
                  {s.value}
                </dt>
                <dd className="text-[13px] leading-snug opacity-75 sm:mt-2">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.slice(0, 5).map((s) => (
            <span key={s} className="rounded-full border border-current/30 px-2.5 py-1 text-xs opacity-85">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to={`/projects/${p.slug}`}
            viewTransition
            data-primary
            className="inline-flex h-12 items-center gap-2 rounded-full bg-feature-accent px-[22px] text-[15px] font-semibold text-feature transition hover:-translate-y-0.5"
          >
            View case study <ArrowRight className="size-4" />
          </Link>
          {code && (
            <a
              href={code}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-full border-[1.5px] border-current/35 px-[22px] text-[15px] font-semibold"
            >
              Code
            </a>
          )}
        </div>
      </div>
      <Link to={`/projects/${p.slug}`} viewTransition aria-label={`Open ${p.title}`} data-cursor="View" className={`block min-w-0 ${hoverLift}`}>
        <Shot project={p} variant={0} />
      </Link>
    </Reveal>
  )
}

function Second({ project: p }: { project: ShippedWithHtml }) {
  return (
    <Reveal
      as="article"
      index={1}
      {...cardProps}
      className={`group relative cursor-pointer flex flex-col overflow-hidden rounded-[28px] bg-sage px-6 pt-7 sm:px-9 sm:pt-9 ${hoverLift}`}
    >
      <div className="text-xs font-bold tracking-[0.14em] uppercase opacity-80">
        {num(1)} · {p.category}
      </div>
      <Title project={p} className="mt-3 text-[clamp(40px,4vw,56px)]" />
      <p className="mt-3 max-w-[40ch] text-base leading-relaxed opacity-85">{p.summary}</p>
      {p.proof && (
        <dl className="mt-5 grid grid-cols-3 gap-4">
          {p.proof.map((s) => (
            <div key={s.label}>
              <dt className="font-serif text-[clamp(26px,2.6vw,34px)] leading-none whitespace-nowrap">{s.value}</dt>
              <dd className="mt-1.5 text-xs leading-snug opacity-80">{s.label}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <CaseLink project={p} />
        {p.liveSoon && !filled(p.links.live) && <LiveSoon size="sm" />}
      </div>
      {p.cover && (
        <Link
          to={`/projects/${p.slug}`}
          viewTransition
          tabIndex={-1}
          aria-hidden
          data-cursor="View"
          className="mt-7 -mr-6 ml-6 block origin-bottom-right translate-y-2.5 -rotate-2 overflow-hidden rounded-tl-2xl border-t-[6px] border-l-[6px] border-white shadow-[-20px_-10px_40px_-20px_rgba(43,30,26,0.45)] transition-transform duration-500 ease-out-soft group-hover:translate-y-0 group-hover:rotate-0 sm:-mr-9 sm:ml-9"
        >
          <img src={p.cover} alt="" className="block w-full" />
        </Link>
      )}
    </Reveal>
  )
}

function Third({ project: p, index }: { project: ShippedWithHtml; index: number }) {
  return (
    <Reveal
      as="article"
      index={2}
      {...cardProps}
      className={`flex cursor-pointer flex-col rounded-[28px] border border-line bg-surface p-6 sm:p-7 ${hoverLift}`}
    >
      <div className="text-xs font-bold tracking-[0.14em] text-muted uppercase">
        {num(index)} · {p.category}
      </div>
      <Title project={p} className="mt-3 text-[34px]" />
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <CaseLink project={p} label="View project" />
        {p.liveSoon && !filled(p.links.live) && <LiveSoon size="sm" />}
      </div>
      {p.cover && (
        <Link
          to={`/projects/${p.slug}`}
          viewTransition
          tabIndex={-1}
          aria-hidden
          data-cursor="View"
          className="relative mt-5 block overflow-hidden rounded-xl border border-line lg:min-h-[200px] lg:flex-1"
        >
          {/* On wide screens the screenshot fills the rest of the card, so it matches the card beside it */}
          <img src={p.cover} alt="" className="block w-full lg:absolute lg:inset-0 lg:h-full lg:object-cover lg:object-top-left" />
        </Link>
      )}
    </Reveal>
  )
}
