import { Button } from '../components/Button'
import { Download } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { profile } from '../lib/content'
import { trackGlow } from '../lib/glow'
import { filled } from '../lib/todo'

export function Hero() {
  const linkedin = filled(profile.links.linkedin)
  return (
    <section id="top" onMouseMove={trackGlow} className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div aria-hidden className="glow absolute inset-0 [--glow-size:520px]" />
      <div className="relative mx-auto max-w-[1120px] px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        {profile.status.open && (
          <Reveal className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] text-muted">
            <span aria-hidden className="size-2 rounded-full bg-accent" />
            {profile.status.text}
          </Reveal>
        )}
        <Reveal index={1}>
          <h1 className="mt-7 max-w-[14ch] text-[clamp(40px,6vw,72px)] leading-[1.04] font-bold tracking-[-0.035em]">
            {profile.headline}
          </h1>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">{profile.intro}</p>
        </Reveal>
        <Reveal index={3} className="mt-9 flex flex-wrap gap-3">
          <Button href={profile.links.cv} variant="primary" download>
            <Download className="size-4" />
            Download CV
          </Button>
          <Button href={profile.links.github}>GitHub</Button>
          {linkedin && <Button href={linkedin}>LinkedIn</Button>}
        </Reveal>
      </div>
    </section>
  )
}
