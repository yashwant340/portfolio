import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { ShippedProject } from '../content/schema'

type AnyDiagram = NonNullable<ShippedProject['diagram']>
type Diagram = Exclude<AnyDiagram, { modules: unknown }>
type Mono = Extract<AnyDiagram, { modules: unknown }>
type MapNode = Diagram['client']
type Box = { node: MapNode; key: string; x: number; y: number; w: number; h: number; container?: boolean }
type Layout = {
  viewBox: string
  boxes: Box[]
  edges: { d: string; dashed?: boolean }[]
  labels: { x: number; y: number; text: string }[]
  route: string
  group: { x: number; y: number; w: number; h: number } | null
}

const H = 44
const LOOP_MS = 7000

// Two hand-tuned layouts: a wide one, and a tall one for phones where the wide
// drawing would shrink its text below a readable size.
function wideLayout(d: Diagram): Layout {
  const n = d.services.length
  const gap = 12
  const w = (484 - gap * (n - 1)) / n
  const services = d.services.map((node, i) => ({ node, key: `s${i}`, x: 18 + i * (w + gap), y: 178, w, h: H }))
  const boxes: Box[] = [
    { node: d.client, key: 'client', x: 190, y: 18, w: 140, h: H },
    { node: d.gateway, key: 'gateway', x: 190, y: 96, w: 140, h: H },
    ...services,
    { node: d.queue, key: 'queue', x: 190, y: 286, w: 140, h: H },
    { node: d.worker, key: 'worker', x: 110, y: 350, w: 300, h: H },
    ...(d.observability ? [{ node: d.observability, key: 'obs', x: 18, y: 418, w: 484, h: 40 }] : []),
  ]
  const cx = (b: Box) => b.x + b.w / 2
  const job = services.find((s) => s.node.queue === 'job')
  const verdict = services.find((s) => s.node.queue === 'verdict')
  const first = cx(services[0])
  const last = cx(services[n - 1])
  const edges = [
    { d: 'M260 62 V96' },
    { d: `M260 140 V160 M${first} 160 H${last} ${services.map((s) => `M${cx(s)} 160 V178`).join(' ')}` },
    ...(job ? [{ d: `M${cx(job)} 222 V256 H250 V286`, dashed: true }] : []),
    ...(verdict ? [{ d: `M270 286 V256 H${cx(verdict)} V222`, dashed: true }] : []),
    { d: 'M260 330 V350', dashed: true },
  ]
  const labels = [
    { x: 268, y: 84, text: d.requestLabel },
    ...(job ? [{ x: cx(job) + 8, y: 250, text: 'job' }] : []),
    ...(verdict ? [{ x: cx(verdict) - 44, y: 250, text: 'verdict' }] : []),
  ]
  const route = `M260 40 V160 H${job ? cx(job) : 260} V256 H250 V372 V256 H${verdict ? cx(verdict) : 270} V160 H260 V40`
  return { viewBox: '0 0 520 470', boxes, edges, labels, route, group: null }
}

function tallLayout(d: Diagram): Layout {
  const services = d.services.map((node, i) => ({
    node,
    key: `s${i}`,
    x: i % 2 ? 175 : 16,
    y: 174 + Math.floor(i / 2) * 52,
    w: 149,
    h: H,
  }))
  const rows = Math.ceil(services.length / 2)
  const groupBottom = 174 + rows * 52 + 2
  const qy = groupBottom + 28
  const wy = qy + 70
  const boxes: Box[] = [
    { node: d.client, key: 'client', x: 95, y: 10, w: 150, h: H },
    { node: d.gateway, key: 'gateway', x: 95, y: 80, w: 150, h: H },
    ...services,
    { node: d.queue, key: 'queue', x: 95, y: qy, w: 150, h: H },
    { node: d.worker, key: 'worker', x: 45, y: wy, w: 250, h: H },
    ...(d.observability ? [{ node: d.observability, key: 'obs', x: 6, y: wy + 70, w: 328, h: H }] : []),
  ]
  const verdict = services.find((s) => s.node.queue === 'verdict')
  const vx = verdict ? verdict.x + verdict.w - 14 : 312
  const vy = verdict ? verdict.y + verdict.h : groupBottom
  const edges = [
    { d: 'M170 54 V80' },
    { d: 'M170 124 V150' },
    { d: `M170 ${groupBottom} V${qy}`, dashed: true },
    ...(verdict ? [{ d: `M245 ${qy + 22} H${vx} V${vy}`, dashed: true }] : []),
    { d: `M170 ${qy + H} V${wy}`, dashed: true },
  ]
  const labels = [
    { x: 178, y: 72, text: d.requestLabel },
    { x: 178, y: groupBottom + 18, text: 'job' },
    ...(verdict ? [{ x: vx - 40, y: qy + 16, text: 'verdict' }] : []),
  ]
  const route = `M170 32 V172 V${qy + 22} V${wy + 22} V${qy + 22} H${vx} V${vy - 22} V172 H170 V32`
  const height = (d.observability ? wy + 70 + H : wy + H) + 10
  return {
    viewBox: `0 0 340 ${height}`,
    boxes,
    edges,
    labels,
    route,
    group: { x: 6, y: 150, w: 328, h: groupBottom - 150 },
  }
}

// Single service, tall (phones): modules in a 2 × 2 grid inside the API box
function monoTall(d: Mono): Layout {
  const modules = d.modules.map((node, i) => ({
    node,
    key: `m${i}`,
    x: i % 2 ? 175 : 16,
    y: 128 + Math.floor(i / 2) * 52,
    w: 149,
    h: H,
  }))
  const bottom = 128 + Math.ceil(modules.length / 2) * 52 + 4
  const sy = bottom + 50
  const stores = d.stores.map((node, i) => ({ node, key: `st${i}`, x: i ? 175 : 16, y: sy, w: 149, h: H }))
  const cx = (b: Box) => b.x + b.w / 2
  const t = modules[Math.min(d.traceModule, modules.length - 1)]
  const [a, b] = stores.map(cx)
  const mid = bottom + 26
  return {
    viewBox: `0 0 340 ${sy + H + 10}`,
    boxes: [
      { node: d.client, key: 'client', x: 95, y: 10, w: 150, h: H },
      { node: d.server, key: 'server', x: 6, y: 80, w: 328, h: bottom - 80, container: true },
      ...modules,
      ...stores,
    ],
    edges: [{ d: 'M170 54 V80' }, { d: `M${a} ${bottom} V${sy}` }, { d: `M${b} ${bottom} V${sy}` }],
    labels: [
      { x: 178, y: 72, text: d.requestLabel },
      { x: a + 8, y: mid + 4, text: d.stores[0].link },
      { x: b + 8, y: mid + 4, text: d.stores[1].link },
    ],
    route:
      d.traceStore === undefined
        ? `M170 32 V114 H${cx(t)} V${t.y + 22} V${mid} H${b} V${sy + 22} V${mid} H${a} V${sy + 22} V${mid} H${cx(t)} V114 H170 V32`
        : `M170 32 V114 H${cx(t)} V${t.y + 22} V${mid} H${[a, b][d.traceStore]} V${sy + 22} V${mid} H${cx(t)} V114 H170 V32`,
    group: null,
  }
}

// The architecture as a drawn map: solid lines are requests, dashed lines go
// through the queue, and a dot keeps tracing one request's route. Hover, tap
// or focus a box to read what it does; parts marked `mine` are dark and ringed.
export function ArchMap({ diagram }: { diagram: AnyDiagram }) {
  const [selected, setSelected] = useState<MapNode | null>(null)
  const mono = 'modules' in diagram
  // A single-service map is narrow enough that its tall layout reads better at every width
  const wide = mono ? monoTall(diagram) : wideLayout(diagram)
  const tall = mono ? monoTall(diagram) : tallLayout(diagram)
  const trace = mono ? diagram.trace : 'one submission'
  const anyMine = wide.boxes.some((b) => b.node.mine)

  return (
    <div className="mt-5">
      <div className="max-w-[560px] rounded-[24px] bg-surface p-2.5">
        <MapSvg layout={wide} className="hidden sm:block" selected={selected} onSelect={setSelected} label="Architecture diagram" />
        <MapSvg layout={tall} className="sm:hidden" selected={selected} onSelect={setSelected} label="Architecture diagram" />
      </div>
      <div aria-live="polite" className="mt-3 min-h-[62px] max-w-[560px] rounded-2xl bg-feature px-4 py-3.5 text-sm leading-normal text-feature-fg">
        {selected ? (
          <>
            <b className="text-feature-accent">{selected.title}.</b> {selected.info}
          </>
        ) : (
          <>
            <b className="text-feature-accent">Hover or tap a box.</b> The moving dot traces {trace} through the system.
          </>
        )}
      </div>
      {anyMine && (
        <p className="mt-3 flex items-center gap-2 text-[13px] text-muted">
          <span aria-hidden className="inline-block size-3 rounded-[3px] bg-feature ring-2 ring-accent" />
          Built by me
        </p>
      )}
    </div>
  )
}

function MapSvg({
  layout,
  className,
  selected,
  onSelect,
  label,
}: {
  layout: Layout
  className: string
  selected: MapNode | null
  onSelect: (n: MapNode) => void
  label: string
}) {
  const route = useRef<SVGPathElement>(null)
  const dot = useRef<SVGCircleElement>(null)
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const path = route.current
    const c = dot.current
    const el = svg.current
    if (!path || !c || !el) return
    const len = path.getTotalLength()
    const place = (t: number) => {
      const p = path.getPointAtLength(t * len)
      c.setAttribute('cx', String(p.x))
      c.setAttribute('cy', String(p.y))
    }
    place(0)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)
    const tick = (now: number) => {
      if (visible) place((now % LOOP_MS) / LOOP_MS)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [layout.route])

  const onKey = (e: KeyboardEvent, n: MapNode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(n)
    }
  }

  return (
    <svg ref={svg} viewBox={layout.viewBox} className={`arch-map h-auto w-full overflow-visible ${className}`} role="group" aria-label={label}>
      {layout.group && <rect className="arch-group" x={layout.group.x} y={layout.group.y} width={layout.group.w} height={layout.group.h} rx={16} />}
      {layout.edges.map((e) => (
        <path key={e.d} className={`arch-edge ${e.dashed ? 'is-dashed' : ''}`} d={e.d} />
      ))}
      {layout.labels.map((l) => (
        <text key={l.text + l.x} className="arch-label" x={l.x} y={l.y}>
          {l.text}
        </text>
      ))}
      <path ref={route} d={layout.route} fill="none" stroke="none" />
      {layout.boxes.map((b) => (
        <g
          key={b.key}
          tabIndex={0}
          role="button"
          aria-label={`${b.node.title}${b.node.mine ? ', built by me' : ''}`}
          aria-pressed={selected === b.node}
          className={`arch-node ${b.node.mine ? 'is-mine' : ''} ${b.container ? 'is-container' : ''} ${selected === b.node ? 'is-selected' : ''}`}
          onPointerEnter={() => onSelect(b.node)}
          onClick={() => onSelect(b.node)}
          onFocus={() => onSelect(b.node)}
          onKeyDown={(e) => onKey(e, b.node)}
        >
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={b.container ? 18 : 12} />
          <text x={b.x + 13} y={b.y + 19}>
            {b.node.title}
          </text>
          <text className="is-detail" x={b.x + 13} y={b.y + 35}>
            {b.node.detail}
          </text>
        </g>
      ))}
      <circle ref={dot} r={6} className="arch-dot" />
    </svg>
  )
}
