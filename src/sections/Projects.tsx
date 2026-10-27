import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { Shot } from '../components/Shot'
import { projects, shippedProjects } from '../lib/content'

export function Projects() {
  const upcoming = projects.filter((p) => p.status === 'in-progress')

  return (
    <section id="projects" className="mx-auto max-w-[1120px] px-6 pt-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-[40px] font-bold tracking-[-0.03em]">Selected projects</h2>
        <span className="text-sm text-muted">
          {shippedProjects.length} shipped
          {upcoming.length > 0 && ` · ${upcoming.length} in progress`}
        </span>
      </Reveal>

      {shippedProjects.map((p, i) => (
        <Reveal
          key={p.slug}
          className={`group flex flex-wrap items-center gap-14 ${i === 0 ? 'mt-[72px]' : 'mt-28'} ${
            i % 2 ? 'flex-row-reverse' : ''
          }`}
        >
          <Link
            to={`/projects/${p.slug}`}
            viewTransition
            aria-label={`Open ${p.title}`}
            className={`min-w-0 flex-[7_1_420px] transition duration-500 ease-out-soft group-hover:-translate-y-1.5 motion-reduce:group-hover:translate-y-0 ${
              i % 2 ? 'group-hover:rotate-[0.4deg]' : 'group-hover:-rotate-[0.4deg]'
            } [&>div]:transition [&>div]:duration-500 group-hover:[&>div]:border-accent group-hover:[&>div]:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]`}
          >
            <Shot project={p} variant={i} />
          </Link>
          <div className="min-w-0 flex-[5_1_320px]">
            <div className="text-[13px] font-semibold text-accent">
              {String(i + 1).padStart(2, '0')} · {p.category}
            </div>
            <h3
              className="mt-3 text-4xl font-bold tracking-[-0.03em]"
              style={{ viewTransitionName: `title-${p.slug}` }}
            >
              {p.title}
            </h3>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">{p.summary}</p>
            <ul className="mt-6 flex flex-col gap-2.5 text-[15px]">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2.5">
                  <span aria-hidden className="text-accent">—</span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-[13px] text-muted">{p.stack.slice(0, 4).join(' · ')}</div>
            <Link
              to={`/projects/${p.slug}`}
              viewTransition
              className="group/cta mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-accent"
            >
              <span className="link-grow">View project</span>
              <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      ))}

      {upcoming.map((p) => (
        <Reveal
          key={p.slug}
          className="mt-28 flex flex-wrap items-center justify-between gap-5 rounded-[20px] border border-dashed border-line px-8 py-7"
        >
          <div className="flex items-center gap-5">
            <span className="text-[13px] font-semibold text-accent">{String(p.order).padStart(2, '0')}</span>
            <div>
              <div className="text-xl font-semibold tracking-tight">{p.title}</div>
              <div className="mt-1 text-[15px] text-muted">{p.summary}</div>
            </div>
          </div>
          <span className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold">In progress</span>
        </Reveal>
      ))}
    </section>
  )
}
