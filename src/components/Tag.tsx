export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-fg">
      {children}
    </span>
  )
}
