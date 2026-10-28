import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../lib/content'
import { useTheme } from '../lib/theme'
import { Close, Menu, Moon, Sun } from './Icons'

const links = [
  { to: '/#projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/#contact', label: 'Contact' },
]

export function Nav() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isActive = (to: string) => to === pathname

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-nav backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/" className="tap-target text-[15px] font-semibold tracking-tight">
          {profile.name}
        </Link>

        <div className="flex items-center gap-7">
          <ul className="hidden gap-6 text-sm text-muted md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  viewTransition
                  aria-current={isActive(l.to) ? 'page' : undefined}
                  className={`tap-target link-grow transition-colors hover:text-fg ${isActive(l.to) ? 'text-fg' : ''}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line transition hover:-translate-y-0.5 hover:border-accent"
            >
              {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </button>
            <a
              href={profile.links.cv}
              download
              className="hidden h-11 items-center rounded-full bg-accent px-[18px] text-sm font-semibold text-accent-fg transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_var(--accent)] sm:flex"
            >
              Download CV
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line md:hidden"
            >
              {open ? <Close className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-line px-6 py-3 md:hidden">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                viewTransition
                onClick={() => setOpen(false)}
                aria-current={isActive(l.to) ? 'page' : undefined}
                className="flex min-h-11 items-center text-[15px]"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={profile.links.cv} download className="flex min-h-11 items-center text-[15px] font-semibold text-accent">
              Download CV
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
