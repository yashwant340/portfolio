import { Reveal } from '../components/Reveal'
import { capabilities, shippedProjects } from '../lib/content'
import { trackGlow } from '../lib/glow'

const projectTitle = (slug: string) => shippedProjects.find((p) => p.slug === slug)?.title

export function Capabilities() {
  return (
    <section id="skills" className="mt-36 border-y border-line bg-surface">
      <div className="mx-auto max-w-[1120px] px-6 py-24">
        <Reveal>
          <h2 className="text-[40px] font-bold tracking-[-0.03em]">What I can build</h2>
          <p className="mt-3 text-base text-muted">
            Capabilities, the tools behind them, and where you can see them working.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} index={i}>
              <div
                onMouseMove={trackGlow}
                className="group relative h-full overflow-hidden rounded-[20px] border border-line bg-bg p-8 transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-accent motion-reduce:hover:translate-y-0"
              >
                <div
                  aria-hidden
                  className="glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [--glow-size:380px] group-hover:opacity-100"
                />
                <div className="relative">
                  <div className="text-[13px] font-semibold text-accent">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="mt-2.5 text-[22px] font-semibold tracking-[-0.02em]">{cap.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{cap.description}</p>
                  <div className="mt-5 text-[13px] leading-relaxed">{cap.tools.join(' · ')}</div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-[13px] text-muted">
                    <span>Used in</span>
                    {cap.usedIn.map((ref) => {
                      const title = projectTitle(ref)
                      // Projects get a filled tag; work experience gets an outlined one.
                      return (
                        <span
                          key={ref}
                          className={`rounded-full px-2.5 py-1 font-medium text-fg ${
                            title ? 'bg-accent-soft' : 'border border-accent'
                          }`}
                        >
                          {title ?? ref}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
