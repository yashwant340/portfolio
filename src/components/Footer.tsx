import { profile } from '../lib/content'

export function Footer() {
  return (
    <footer className="bg-sage-soft">
      <div className="mx-auto max-w-[1180px] px-6 pb-12">
        <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-[13px] text-muted">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Built with React, Vite and Tailwind</span>
        </div>
      </div>
    </footer>
  )
}
