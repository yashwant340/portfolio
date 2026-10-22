import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'lg'
  download?: boolean
}

const base =
  'inline-flex items-center gap-2 rounded-full font-medium transition duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0'
const variants = {
  primary: 'bg-accent text-accent-fg font-semibold hover:shadow-[0_10px_24px_-10px_var(--accent)]',
  ghost: 'border border-line bg-surface hover:border-accent',
}
const sizes = { md: 'h-11 px-[18px] text-sm', lg: 'h-12 px-[22px] text-[15px]' }

export function Button({ href, children, variant = 'ghost', size = 'lg', download }: Props) {
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      download={download || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </a>
  )
}
