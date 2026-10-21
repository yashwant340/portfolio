// Content fields may hold "TODO: ..." placeholders; links and buttons built
// from them are hidden until real values are filled in.
export function filled(value: string | undefined): string | undefined {
  return value && !value.startsWith('TODO') ? value : undefined
}
