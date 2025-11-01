/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime"
import { DataPoint } from "./data-service"

interface ChartProps {
  type: "bar" | "line" | "pie"
  data: DataPoint[]
  width?: number
  height?: number
}

// A lightweight, dependency-free chart that renders using basic DOM elements.
// This avoids runtime refs/effects and keeps the component simple and type-safe.
export const Chart = ({ type, data, width = 500, height = 300 }: ChartProps) => {
  const [getHover] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
        No data
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.value), 0.001)

  const palette = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#4f46e5"]

  if (type === "bar") {
    // Render bars using SVG so labels can be placed precisely.
    const gap = 8
    const bw = (width - gap * (data.length + 1)) / data.length
    const total = data.reduce((s, d) => s + d.value, 0) || 1
    return (
      <svg width={width} height={height} style={{ display: "block" }}>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 24)
          const x = gap + i * (bw + gap)
          const y = height - h - 20
          const pct = Math.round((d.value / total) * 100)
          const color = palette[i % palette.length]
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw} height={h} fill={color} rx={6} />
              <text x={x + bw / 2} y={y - 6} fontSize={11} fill="#222" fontWeight={700} textAnchor="middle">{d.value}</text>
              <text x={x + bw / 2} y={y - 18} fontSize={10} fill="#666" textAnchor="middle">{pct}%</text>
              <text x={x + bw / 2} y={height - 4} fontSize={11} fill="#333" textAnchor="middle">{d.label}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  if (type === "line") {
    // Support multiple series by grouping by category and aligning on unique sorted timestamps.
    const dates = Array.from(new Set(data.map(d => d.date ? new Date(d.date).getTime() : null).filter(Boolean) as number[])).sort((a, b) => a - b)
    if (dates.length === 0) {
      // fallback: treat data as single series by index
      const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d.value / max) * height}`).join(" ")
      return (
        <svg width={width} height={height} style={{ display: "block" }}>
          <polyline points={points} fill="none" stroke={palette[0]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      )
    }

    const groups = new Map<string, { name: string, values: number[] }>()
    for (const d of data) {
      const cat = d.category || 'series'
      if (!groups.has(cat)) groups.set(cat, { name: cat, values: dates.map(() => 0) })
      const idx = dates.indexOf(d.date ? new Date(d.date).getTime() : dates[0])
      if (idx >= 0) groups.get(cat)!.values[idx] = d.value
    }

    const maxY = Math.max(...Array.from(groups.values()).flatMap(g => g.values), 1)

    return (
      <svg width={width} height={height} style={{ display: "block" }}>
        {Array.from(groups.entries()).map(([cat, g], gi) => {
          const pts = g.values.map((v, i) => `${(i / (dates.length - 1 || 1)) * width},${height - (v / maxY) * (height - 12) - 6}`).join(' ')
          const stroke = palette[gi % palette.length]
          return <polyline key={cat} points={pts} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        })}
        {/* Optionally draw small markers */}
        {Array.from(groups.entries()).map(([cat, g], gi) => {
          const stroke = palette[gi % palette.length]
          return g.values.map((v, i) => {
            const x = (i / (dates.length - 1 || 1)) * width
            const y = height - (v / maxY) * (height - 12) - 6
            return <circle key={`${cat}-${i}`} cx={x} cy={y} r={2.5} fill={stroke} />
          })
        })}
      </svg>
    )
  }

  // Pie with percentage labels
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let angle = -Math.PI / 2
  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) / 2 - 8
  const slices = data.map((d, i) => {
    const frac = d.value / total
    const next = angle + frac * Math.PI * 2
    const x1 = cx + Math.cos(angle) * r
    const y1 = cy + Math.sin(angle) * r
    const x2 = cx + Math.cos(next) * r
    const y2 = cy + Math.sin(next) * r
    const large = frac > 0.5 ? 1 : 0
    const dAttr = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
    const mid = angle + (next - angle) / 2
    const lx = cx + Math.cos(mid) * (r * 0.6)
    const ly = cy + Math.sin(mid) * (r * 0.6)
    angle = next
    const color = palette[i % palette.length]
    const pct = Math.round(frac * 100)
    return { d: dAttr, color, label: `${pct}%`, lx, ly }
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {slices.map((s, i) => <path d={s.d} fill={s.color} key={i} />)}
      {slices.map((s, i) => <text key={i} x={s.lx} y={s.ly} fontSize={12} fill="#fff" fontWeight={700} textAnchor="middle" dominantBaseline="middle">{s.label}</text>)}
    </svg>
  )
}
