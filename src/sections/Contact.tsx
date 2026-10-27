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
    <section id="contact" className="mx-auto max-w-[640px] px-6 pt-40 pb-28 text-center">
      <Reveal>
        <div className="text-[13px] font-semibold text-accent">What's next?</div>
        <h2 className="mt-3 text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.03em]">{profile.contact.heading}</h2>
        <p className="mx-auto mt-5 max-w-[50ch] text-[17px] leading-relaxed text-muted">{profile.contact.text}</p>

        {email && (
          <a
            href={`mailto:${email}`}
            className="mt-10 inline-flex h-12 items-center rounded-lg border border-accent px-7 text-[15px] font-medium text-accent transition duration-200 hover:-translate-y-0.5 hover:bg-accent-soft motion-reduce:hover:translate-y-0"
          >
            Say hello
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
                className="flex size-11 items-center justify-center rounded-full text-muted transition duration-200 hover:-translate-y-0.5 hover:text-accent motion-reduce:hover:translate-y-0"
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
