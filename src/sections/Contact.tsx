import { FileText, GitHub, LinkedIn } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { profile } from '../lib/content'
import { filled } from '../lib/todo'

export function Contact() {
  const email = filled(profile.links.email)
  const linkedin = filled(profile.links.linkedin)
  const icons = [
    linkedin && { label: 'LinkedIn', href: linkedin, Icon: LinkedIn },
    { label: 'GitHub', href: profile.links.github, Icon: GitHub },
    { label: 'Download CV', href: profile.links.cv, Icon: FileText, download: true },
  ].filter(Boolean) as { label: string; href: string; Icon: typeof GitHub; download?: boolean }[]

  return (
    <section id="contact" className="closing-glow mt-28 px-6 pt-28 pb-24 text-center lg:pt-36 lg:pb-32">
      <Reveal className="mx-auto max-w-[680px]">
        <div className="inline-block rounded-full bg-fg px-3.5 py-1.5 text-[13px] font-semibold text-bg">What's next?</div>
        <h2 className="mt-5 font-serif text-[clamp(48px,6vw,80px)] leading-none font-normal">{profile.contact.heading}</h2>
        <p className="mx-auto mt-5 max-w-[50ch] text-[17px] leading-relaxed text-muted">{profile.contact.text}</p>

        {email && (
          <a
            href={`mailto:${email}`}
            data-magnetic
            className="mt-9 inline-flex h-[52px] items-center rounded-full bg-accent px-8 text-base font-semibold text-accent-fg transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_var(--accent)] motion-reduce:hover:translate-y-0"
          >
            {profile.contact.button}
          </a>
        )}

        <ul className="mt-10 flex justify-center gap-2">
          {icons.map(({ label, href, Icon, download }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                title={label}
                download={download || undefined}
                target={/^https?:/.test(href) ? '_blank' : undefined}
                rel="noreferrer"
                className="flex size-11 items-center justify-center rounded-full border border-fg/15 text-fg transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent motion-reduce:hover:translate-y-0"
              >
                <Icon className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
