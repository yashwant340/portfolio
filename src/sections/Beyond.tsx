import { InterestIcon } from '../components/InterestIcon'
import { Reveal } from '../components/Reveal'
import { beyond } from '../lib/content'

export function Beyond() {
  return (
    <section id="beyond" className="mx-auto max-w-[1180px] px-6 pt-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] bg-sage p-7 sm:p-10">
          <span aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-bg opacity-25" />
          <div className="relative flex flex-wrap items-center gap-10">
            <h2 className="flex-none font-serif text-[clamp(34px,3.6vw,44px)] leading-none font-normal">Beyond code</h2>
            <ul className="grid flex-[1_1_520px] gap-8 sm:grid-cols-3">
              {beyond.map((item, i) => (
                <Reveal as="li" key={i} delay={250 + i * 180} className="group/item">
                  <div className="transition-transform duration-300 ease-out-soft group-hover/item:-translate-y-1 motion-reduce:group-hover/item:translate-y-0">
                    <InterestIcon
                      name={item.icon ?? 'sparkle'}
                      className="size-8 text-fg group-hover/item:animate-[wiggle_0.6s_ease-in-out] motion-reduce:group-hover/item:animate-none"
                    />
                    <div className="mt-4 font-serif text-2xl leading-none">
                      {item.title}
                    </div>
                    <div className="mt-1.5 text-sm leading-relaxed text-fg/80">{item.detail}</div>
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
