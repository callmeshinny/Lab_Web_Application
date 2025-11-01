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

  if (type === "bar") {
    return (
      <div style={{ width, height, display: "flex", alignItems: "end", gap: 8, padding: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", background: "#eee", height: "100%", display: "flex", alignItems: "end", justifyContent: "center" }}>
              <div title={`${d.label}: ${d.value}`} style={{ width: "80%", background: "#4f46e5", height: `${(d.value / max) * 100}%`, transition: "height 200ms" }} />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: "#333" }}>{d.label}</div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "line") {
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d.value / max) * height}`).join(" ")
    return (
      <svg width={width} height={height} style={{ display: "block" }}>
        <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    )
  }

  // Pie
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
    angle = next
    const color = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"][i % 5]
    return { d: dAttr, color }
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {slices.map((s, i) => <path d={s.d} fill={s.color} key={i} />)}
    </svg>
  )
}
