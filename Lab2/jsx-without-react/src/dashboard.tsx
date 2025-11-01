/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime"
import { Chart } from "./chart"

interface Todo {
  id: number
  task: string
  done: boolean
}

interface HistorySample {
  ts: number
  inProgress: number
  completed: number
}

interface DashboardProps {
  todos: Todo[]
  history: HistorySample[]
}

export const Dashboard = ({ todos, history }: DashboardProps) => {
  const [getType, setType] = useState<'bar' | 'line' | 'pie'>('bar')

  const total = todos.length
  const completed = todos.filter(t => t.done).length
  const inProgress = total - completed

  const data = [
    { label: 'In Progress', value: inProgress, category: 'state' },
    { label: 'Completed', value: completed, category: 'state' },
  ]

  const colors = ['#f59e0b', '#10b981']

  const container = { background: 'white', borderRadius: 12, padding: 16, width: '100%', boxShadow: '0 14px 36px rgba(100,40,160,0.06)' }
  const tabs = { display: 'flex', gap: 8, marginBottom: 12 }
  const tabBtn = (active: boolean) => ({ padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: active ? '#f3e6ff' : '#fff', fontWeight: 800, color: '#4b2b7a' })
  const legendRow = { display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }

  // Build a small line-series from history samples (last 12 points)
  const series = history.slice(-12).map((s, i) => ({ label: new Date(s.ts).toLocaleTimeString(), value: s.inProgress, date: new Date(s.ts), category: 'inprogress' }))
  const seriesCompleted = history.slice(-12).map((s, i) => ({ label: new Date(s.ts).toLocaleTimeString(), value: s.completed, date: new Date(s.ts), category: 'completed' }))

  return (
    <div style={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#4b2b7a' }}>Dashboard</div>
        <div style={{ fontSize: 12, color: '#666' }}>{completed} completed / {total} total</div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {/* Bar chart: counts */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Bar</div>
          <Chart type={'bar'} data={data as any} width={260} height={160} />
        </div>

        {/* Line chart: history of in-progress (and we overlay completed as separate series by combining values) */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Line</div>
          {/* For simplicity the Chart component draws a single polyline; we draw in-progress series here. If you want both series overlaid, we can extend Chart later. */}
          <Chart type={'line'} data={series as any} width={260} height={160} />
        </div>

        {/* Pie chart: proportion */}
        <div style={{ flex: '0 0 160px', textAlign: 'center' as const }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Pie</div>
          <Chart type={'pie'} data={data as any} width={160} height={160} />
        </div>
      </div>

      <div style={legendRow}>
        {data.map((d, i) => {
          const pct = total === 0 ? 0 : Math.round((d.value / total) * 100)
          return (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: colors[i] }} />
              <div style={{ fontSize: 13, color: '#333', fontWeight: 700 }}>{d.label} — {pct}% ({d.value})</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
