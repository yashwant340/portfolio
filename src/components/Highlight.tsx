// Renders **highlighted** words from content in italic accent, e.g. "Hi, I'm **Yaswanth.**"
export function Highlight({ text, className = 'text-accent' }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? (
          <i key={i} className={className}>
            {part}
          </i>
        ) : (
          part
        ),
      )}
    </>
  )
}
