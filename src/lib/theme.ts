import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function readTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function saved(): Theme | null {
  try {
    const t = localStorage.getItem('theme')
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Follows the OS setting until the visitor picks a theme with the toggle.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (saved()) return
      const next = media.matches ? 'dark' : 'light'
      apply(next)
      setTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    const swap = () => {
      apply(next)
      setTheme(next)
    }
    if (document.startViewTransition) document.startViewTransition(swap)
    else swap()
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Private mode or blocked storage: the choice just won't persist.
    }
  }, [])

  return { theme, toggle }
}
