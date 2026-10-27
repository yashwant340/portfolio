import { InterestIcon } from '../components/InterestIcon'
import { Reveal } from '../components/Reveal'
import { beyond } from '../lib/content'
import { trackGlow } from '../lib/glow'

export function Beyond() {
  return (
    <section id="beyond" className="mx-auto max-w-[1120px] px-6 pt-28">
      <Reveal>
        <div
          onMouseMove={trackGlow}
          className="group/band relative overflow-hidden rounded-3xl bg-accent-soft p-10"
        >
          <div
            aria-hidden
            className="glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [--glow-size:420px] group-hover/band:opacity-100"
          />
          <div className="relative flex flex-wrap items-center gap-10">
            <h2 className="flex-none text-[28px] font-bold tracking-[-0.02em]">Beyond code</h2>
            <ul className="grid flex-[1_1_520px] gap-8 sm:grid-cols-3">
              {beyond.map((item, i) => (
                <Reveal as="li" key={i} delay={250 + i * 180} className="group/item">
                  <div className="transition-transform duration-300 ease-out-soft group-hover/item:-translate-y-1 motion-reduce:group-hover/item:translate-y-0">
                    <InterestIcon
                      name={item.icon ?? 'sparkle'}
                      className="size-8 text-accent group-hover/item:animate-[wiggle_0.6s_ease-in-out] motion-reduce:group-hover/item:animate-none"
                    />
                    <div className="mt-4 text-base font-semibold transition-colors group-hover/item:text-accent">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
