import { useRef } from 'react'
import type { ShippedProject } from '../content/schema'
import { Play } from './Icons'

type Props = {
  project: ShippedProject
  /** Alternates the placeholder layout when no screenshot is set yet. */
  variant: number
}

// Browser-framed project preview. Shows the cover screenshot, plays the muted
// preview clip while hovered, and falls back to an abstract placeholder.
export function Shot({ project, variant }: Props) {
  const video = useRef<HTMLVideoElement>(null)

  return (
    <div
      className="group/shot relative overflow-hidden rounded-[20px] border border-line bg-surface"
      onMouseEnter={() => video.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (!video.current) return
        video.current.pause()
        video.current.currentTime = 0
      }}
      style={{ viewTransitionName: `shot-${project.slug}` }}
    >
      <div className="flex h-9 items-center gap-1.5 border-b border-line px-3.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
      </div>
      <div className="relative aspect-[2940/1414] bg-media">
        {project.cover ? (
          <img src={project.cover} alt={`${project.title} screenshot`} className="absolute inset-0 size-full object-cover" />
        ) : variant % 2 === 0 ? (
          <div className="absolute inset-0 flex flex-col gap-3.5 p-6" aria-hidden>
            <div className="flex gap-3">
              <div className="h-16 flex-1 rounded-[10px] bg-accent-soft" />
              <div className="h-16 flex-1 rounded-[10px] bg-grid" />
              <div className="h-16 flex-1 rounded-[10px] bg-grid" />
              <div className="h-16 flex-1 rounded-[10px] bg-grid" />
            </div>
            <div className="flex-1 rounded-[10px] border border-line bg-[linear-gradient(180deg,transparent_50%,var(--accent-soft)_50%)]" />
          </div>
        ) : (
          <div className="absolute inset-0 flex gap-4 p-6" aria-hidden>
            <div className="w-[26%] rounded-[10px] bg-grid" />
            <div className="flex flex-1 flex-col gap-2.5">
              <div className="h-7 rounded-lg bg-accent-soft" />
              <div className="h-7 rounded-lg bg-grid" />
              <div className="h-7 rounded-lg bg-grid" />
              <div className="h-7 rounded-lg bg-grid" />
              <div className="h-7 rounded-lg bg-grid" />
            </div>
          </div>
        )}
        {project.preview && (
          <video
            ref={video}
            src={project.preview}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover/shot:opacity-100"
          />
        )}
      </div>
      {project.preview && (
        <div className="absolute bottom-5 left-5 inline-flex translate-y-1.5 items-center gap-1.5 rounded-full bg-fg px-3 py-1.5 text-xs font-semibold text-bg opacity-0 transition duration-300 group-hover/shot:translate-y-0 group-hover/shot:opacity-100">
          <Play className="size-2.5" />
          Playing preview
        </div>
      )}
    </div>
  )
}
