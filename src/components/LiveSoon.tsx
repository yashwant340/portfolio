import { profile } from '../lib/content'

// Pill for shipped projects that don't have a live demo URL yet
export function LiveSoon({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-dashed border-accent/60 font-medium text-muted ${
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-11 px-[18px] text-sm'
      }`}
    >
      <span className="relative flex size-2" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      {profile.liveDemoSoon.label}
    </span>
  )
}
