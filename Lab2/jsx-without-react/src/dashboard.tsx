/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime"
import { Chart } from "./chart"

interface Todo {
  id: number
  task: string
  done: boolean
}

interface DashboardProps {
  todos: Todo[]
}

export const Dashboard = ({ todos }: DashboardProps) => {
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

  return (
    <div style={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#4b2b7a' }}>Dashboard</div>
        <div style={{ fontSize: 12, color: '#666' }}>{completed} completed / {total} total</div>
      </div>

      <div style={tabs}>
        <button style={tabBtn(getType() === 'bar')} onClick={() => setType('bar')}>Bar</button>
        <button style={tabBtn(getType() === 'line')} onClick={() => setType('line')}>Line</button>
        <button style={tabBtn(getType() === 'pie')} onClick={() => setType('pie')}>Pie</button>
      </div>

      <div>
        <Chart type={getType()} data={data as any} width={300} height={200} />
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
    </div>
  )
}

export default Dashboard
