/** @jsx createElement */
import { createElement } from "./jsx-runtime"
import { DataPoint } from "./data-service"

interface ChartProps {
  type: "bar" | "line" | "pie"
  data: DataPoint[]
  width?: number
  height?: number
}

export const Chart = ({ type, data, width = 380, height = 260 }: ChartProps) => {
  let canvasRef: HTMLCanvasElement | null = null

  // Hàm vẽ chính
  const drawAll = (canvas: HTMLCanvasElement | null) => {
    console.log("[Chart] drawAll called", { type, dataLen: data?.length })
    if (!canvas) return
    canvasRef = canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.warn("[Chart] No context found")
      return
    }

    // Setup retina scaling
    const DPR = window.devicePixelRatio || 1
    canvas.width = Math.floor(width * DPR)
    canvas.height = Math.floor(height * DPR)
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

    // Background
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "rgba(255,255,255,0.98)"
    ctx.fillRect(0, 0, width, height)

    if (!data || data.length === 0) {
      ctx.fillStyle = "#999"
      ctx.font = "14px Poppins"
      ctx.textAlign = "center"
      ctx.fillText("No data", width / 2, height / 2)
      return
    }

    if (type === "bar") drawBarChart(ctx)
    else if (type === "line") drawLineChart(ctx)
    else drawPieChart(ctx)
  }

  // 🔹 Bar chart
  const drawBarChart = (ctx: CanvasRenderingContext2D) => {
    console.log("[Chart] drawBarChart data:", data)
    const padding = 28
    const gap = 16
    const availW = width - padding * 2
    const barWidth = Math.max(12, (availW - (data.length - 1) * gap) / data.length)
    const maxVal = Math.max(...data.map(d => d.value), 1)

    data.forEach((d, i) => {
      const barHeight = (d.value / maxVal) * (height - padding * 2 - 20)
      const x = padding + i * (barWidth + gap)
      const y = height - padding - barHeight
      const isCompleted = d.label.toLowerCase().includes("complet")
      ctx.fillStyle = isCompleted ? "#9cd6ff" : "#c7a3ff"
      ctx.fillRect(x, y, barWidth, barHeight)
      ctx.fillStyle = "#333"
      ctx.font = "12px Poppins"
      ctx.textAlign = "center"
      ctx.fillText(String(d.value), x + barWidth / 2, y - 6)
      ctx.fillText(d.label, x + barWidth / 2, height - padding + 18)
    })
  }

  // 🔹 Line chart
  const drawLineChart = (ctx: CanvasRenderingContext2D) => {
    const padding = 28
    const maxVal = Math.max(...data.map(d => d.value), 1)
    const pts = data.map((d, i) => {
      const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2)
      const y = height - padding - (d.value / maxVal) * (height - padding * 2 - 20)
      return { x, y, v: d.value }
    })

    ctx.beginPath()
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    ctx.strokeStyle = "#7a43ff"
    ctx.lineWidth = 2
    ctx.stroke()

    pts.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#7a43ff"
      ctx.fill()
      ctx.fillStyle = "#222"
      ctx.font = "12px Poppins"
      ctx.textAlign = "center"
      ctx.fillText(String(p.v), p.x, p.y - 8)
    })
  }

  // 🔹 Pie chart
  const drawPieChart = (ctx: CanvasRenderingContext2D) => {
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1
    let startAngle = -Math.PI / 2
    const cx = width / 2
    const cy = height / 2
    const r = Math.min(width, height) / 2.6

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI
      const hue = (i * 120) % 360
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = `hsl(${hue}, 70%, 70%)`
      ctx.fill()

      const mid = startAngle + sliceAngle / 2
      const lx = cx + Math.cos(mid) * (r + 16)
      const ly = cy + Math.sin(mid) * (r + 16)
      const pct = Math.round((d.value / total) * 100)
      ctx.fillStyle = "#333"
      ctx.font = "12px Poppins"
      ctx.textAlign = mid > Math.PI / 2 || mid < -Math.PI / 2 ? "right" : "left"
      ctx.fillText(`${d.label}: ${pct}%`, lx, ly)
      startAngle += sliceAngle
    })
  }

  // 🔹 Trigger re-draw mỗi lần component re-render
  // (bởi vì JSX-runtime custom không có useEffect)
  try {
    setTimeout(() => {
      const canvas = document.querySelector("canvas")
      if (canvas && canvasRef && canvas === canvasRef) {
        drawAll(canvas)
      }
    }, 0)
  } catch (e) {
    console.warn("[Chart] redraw failed", e)
  }

  return (
    <canvas
      ref={(el: any) => drawAll(el)}
      width={width}
      height={height}
      style={{
        display: "block",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "white",
        boxShadow: "inset 0 0 8px rgba(0,0,0,0.03)",
      }}
    />
  )
}
