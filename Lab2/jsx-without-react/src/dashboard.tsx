/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime"
import { Chart } from "./chart"
import { Card } from "./components"

interface TodoItem { id: number; task: string; done: boolean }

interface DashboardProps {
  todos: TodoItem[]
  filter: 'all' | 'active' | 'completed'
}

export default function Dashboard({ todos, filter }: DashboardProps) {
  const [getType, setType] = useState<"bar" | "line" | "pie">("bar")

  // Build chart data synchronously from todos + filter (no useEffect in this runtime)
  const total = todos.length
  const completed = todos.filter(t => t.done).length
  const inProgress = total - completed

  let chartData: { label: string; value: number; category: string; date: Date }[] = []
  if (filter === 'all') {
    chartData = [
      { label: 'In Progress', value: inProgress, category: 'progress', date: new Date() },
      { label: 'Completed', value: completed, category: 'completed', date: new Date() },
    ]
  } else {
    const visible = todos.filter(t => (filter === 'active' ? !t.done : t.done))
    chartData = visible.length === 0
      ? [{ label: 'None', value: 0, category: 'task', date: new Date() }]
      : visible.map(t => ({ label: t.task.length > 10 ? t.task.slice(0, 10) + '…' : t.task, value: 1, category: 'task', date: new Date() }))
  }

  // 🟣 Button chuyển loại chart
  const chartTypeBtn = (type: "bar" | "line" | "pie", label: string) => (
    <button
      style={{
        padding: "8px 16px",
        borderRadius: 9999,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
        background: getType() === type ? "#cdb5ff" : "#ede2ff",
        color: "#4b1d92",
        boxShadow: getType() === type ? '0 8px 20px rgba(120,80,160,0.12)' : 'none',
        transition: 'all 180ms ease',
      }}
      onClick={() => setType(type)}
    >
      {label}
    </button>
  )

  // 🟣 Tính toán thống kê hiển thị (reuse values computed above)
  const percent = total ? Math.round((inProgress / total) * 100) : 0

  return (
    <Card title="Dashboard" className="dashboard-card">
      {/* Nút chọn loại chart */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {chartTypeBtn("bar", "Bar")}
        {chartTypeBtn("line", "Line")}
        {chartTypeBtn("pie", "Pie")}
      </div>

      {/* Chart */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Chart
          key={`${getType()}-${filter}-${total}-${completed}`}
          type={getType()}
          data={chartData}
          width={300}
          height={200}
        />
      </div>

      {/* Chú thích dưới biểu đồ */}
      <div style={{ marginTop: 12, fontSize: 13, color: "#5c3d9e", textAlign: "center" }}>
        {`${inProgress} / ${total} (${percent}% in progress)`}
      </div>
    </Card>
  )
}
