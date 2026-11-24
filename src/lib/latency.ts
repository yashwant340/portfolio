// Latencies span ~1 ms to ~100 ms, so the chart uses a log scale: on a linear one
// the fastest operations shrink to a couple of pixels. Each tick is 10x the last.
const LOG_MIN = 0.5
export const logPos = (v: number, max: number) => (Math.log(Math.max(v, LOG_MIN) / LOG_MIN) / Math.log(max / LOG_MIN)) * 100
export const decadeAbove = (n: number) => 10 ** Math.ceil(Math.log10(n))

export const fmt = (n: number) => (n < 10 ? n.toFixed(1) : n.toFixed(1).replace(/\.0$/, ''))
