/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime"
import { DataPoint } from "./data-service"

interface ChartProps {
  type: "bar" | "line" | "pie"
  data: DataPoint[]
  width?: number
  height?: number
}

export const Chart = ({ type, data, width = 500, height = 300 }: ChartProps) => {
  const [getHover, setHover] = useState<number | null>(null)

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height)
    if (!data || data.length === 0) return

    if (type === "bar") drawBarChart(ctx)
    else if (type === "line") drawLineChart(ctx)
    else drawPieChart(ctx)
  }

  const drawBarChart = (ctx: CanvasRenderingContext2D) => {
    const barWidth = width / data.length - 10
    const maxVal = Math.max(...data.map(d => d.value))
    data.forEach((d, i) => {
      const x = i * (barWidth + 10) + 20
      const barHeight = (d.value
