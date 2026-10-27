import { Reveal } from '../components/Reveal'
import { journey } from '../lib/content'

const dot: Record<'past' | 'current' | 'next', string> = {
  past: 'bg-muted',
  current: 'bg-accent',
  next: 'border-2 border-dashed border-accent bg-bg',
}

// The line draws first (1.4s); steps follow along it.
const STEP_DELAY = 250
const STEP_GAP = 220

export function Journey() {
  return (
    <section id="journey" className="mx-auto max-w-[1120px] px-6 pt-28">
      <Reveal>
        <h2 className="text-[28px] font-bold tracking-[-0.02em]">Journey</h2>
      </Reveal>
      <div className="relative mt-12">
        <Reveal
          variant="line"
          className="absolute top-2 bottom-2 left-[7px] w-px bg-line lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
        />
        <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
          {journey.steps.map((step, i) => (
            <Reveal as="li" key={i} delay={STEP_DELAY + i * STEP_GAP} className="group relative pl-10 lg:pl-0">
              {/* Outer span pops in on reveal; inner span handles the hover effect */}
              <span aria-hidden className="pop absolute top-1 left-0 block size-[15px] lg:static">
                <span
                  className={`block size-full rounded-full ring-[3px] ring-bg transition duration-300 group-hover:scale-125 group-hover:bg-accent group-hover:shadow-[0_0_0_6px_var(--accent-soft)] ${dot[step.state ?? 'past']}`}
                />
              </span>
              <div
                className={`text-[13px] lg:mt-5 ${step.state === 'current' ? 'font-semibold text-accent' : 'text-muted'}`}
              >
                {step.period}
              </div>
              <div className="mt-1.5 text-[17px] font-semibold">{step.title}</div>
              {step.detail && <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{step.detail}</p>}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
