import { Button } from '../components/Button'
import { Download } from '../components/Icons'
import { IdBadge } from '../components/IdBadge'
import { Reveal } from '../components/Reveal'
import { RotatingWord } from '../components/RotatingWord'
import { profile } from '../lib/content'

// Renders **highlighted** words in italic accent
function headline(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <i key={i} className="text-accent">
        {part}
      </i>
    ) : (
      part
    ),
  )
}

export function Hero() {
  return (
    <section id="top" className="hero-sunset relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-[1180px] items-center px-6 lg:min-h-[calc(86vh-64px)] lg:grid-cols-2">
        <div className="relative z-[2] pt-16 pb-6 lg:py-20">
          {profile.status.open && (
            <Reveal className="inline-block rounded-2xl bg-fg px-3.5 py-1.5 text-[13px] leading-snug text-bg sm:rounded-full">
              {profile.status.text}
            </Reveal>
          )}
          <Reveal index={1}>
            <h1 className="mt-6 font-serif text-[clamp(54px,6.6vw,96px)] leading-[0.98] font-normal tracking-[-0.01em]">
              {headline(profile.headline)}
            </h1>
          </Reveal>
          <Reveal index={2} className="mt-4">
            <RotatingWord lead={profile.hero.buildsLead} words={profile.hero.builds} />
          </Reveal>
          <Reveal index={3}>
            <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-muted">{profile.intro}</p>
          </Reveal>
          <Reveal index={4} className="mt-8 flex flex-wrap gap-3">
            <Button href={profile.links.cv} variant="primary" download magnetic>
              <Download className="size-4" />
              Download CV
            </Button>
            <Button href="#projects" variant="outline">
              {profile.hero.workButton}
            </Button>
          </Reveal>
        </div>

        <IdBadge />
      </div>
    </section>
  )
}
