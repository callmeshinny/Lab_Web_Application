/** @jsx createElement */
import { createElement, mount, useState } from "./jsx-runtime"
import { Counter } from "./counter"
import { TodoApp } from "./todo-app"
import { Dashboard } from "./dashboard"

type Filter = 'all' | 'active' | 'completed'
interface Todo { id: number; task: string; done: boolean }

// 🎨 Layout chính
const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'flex-start',
  // NOTE: Debug border to verify app renders — remove this after confirmation
  border: '2px solid rgba(255,0,0,0.05)',
  background: 'linear-gradient(180deg,#f6efff,#efe1ff)', // ✅ pastel tím
  fontFamily: 'Poppins, sans-serif',
  boxSizing: 'border-box' as const,
  paddingTop: '72px',
  paddingBottom: '60px',
}

// Layout row: left reserved, center todo, right counter
const contentRow = {
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}

const innerRow = {
  width: '100%',
  maxWidth: '1200px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '40px',
}

const leftCol = {
  width: '340px',
  minWidth: '300px',
}

const centerCol = {
  flex: '0 0 440px',
  display: 'flex',
  justifyContent: 'center',
}

const rightCol = {
  width: '320px',
  minWidth: '240px',
  display: 'flex',
  justifyContent: 'flex-end',
}

const pageHeader = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '18px',
}

const headerInner = {
  width: '100%',
  maxWidth: '1100px',
  padding: '0 24px',
}

const titleStyle = {
  fontSize: '64px',
  color: '#6a3ecf',
  fontWeight: 900,
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
}

const App = () => {
  const [getTodos, setTodos] = useState<Todo[]>([])
  const [getHistory, setHistory] = useState<{ ts: number; inProgress: number; completed: number }[]>([])
  const [getFilter, setFilter] = useState<Filter>('all')

  const todos = getTodos()
  const total = todos.length
  const completed = todos.filter(t => t.done).length
  const inProgress = total - completed

  // Wrap setTodos so we snapshot counts for dashboard history whenever todos change via this setter
  const setTodosAndSnapshot = (newTodos: Todo[]) => {
    setTodos(newTodos)
    const completedNow = newTodos.filter(t => t.done).length
    const totalNow = newTodos.length
    const sample = { ts: Date.now(), inProgress: totalNow - completedNow, completed: completedNow }
    setHistory([...getHistory(), sample])
  }

  const leftCard = {
    background: 'linear-gradient(180deg,#f3e6ff,#e9d6ff)',
    borderRadius: 16,
    padding: '18px',
    marginBottom: 18,
    textAlign: 'center' as const,
    boxShadow: '0 12px 30px rgba(120,80,160,0.06)',
  }

  const smallTitle = { fontWeight: 700, color: '#3b0b5f', marginBottom: 6 }

  const trackCard = {
    background: 'linear-gradient(180deg,#eedbff,#ecd6ff)',
    borderRadius: 12,
    padding: '22px',
    color: '#6a2f84',
    minHeight: 180,
  }

  return (
    <div style={pageStyle}>
      <div style={pageHeader}>
        <div style={headerInner}>
          <div style={titleStyle}>REACT WITHOUT JSX</div>
        </div>
      </div>

      <div style={contentRow}>
        <div style={innerRow}>
          {/* LEFT: Counter + Stats */}
          <div style={leftCol}>
            <div style={leftCard}>
              <Counter initialCount={0} />
            </div>

            <div style={trackCard}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Task list</div>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Completed / Total: {completed} / {total}</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <button
                  style={{
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: 'none',
                    background: getFilter() === 'active' ? '#ffdfe8' : '#fff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: '#6a2f84',
                  }}
                  onClick={() => setFilter('active')}
                >
                  IN PROGRESS
                </button>
                <button
                  style={{
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: 'none',
                    background: getFilter() === 'completed' ? '#ffdfe8' : '#fff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: '#6a2f84',
                  }}
                  onClick={() => setFilter('completed')}
                >
                  COMPLETED
                </button>
              </div>
            </div>
          </div>

          {/* CENTER: Todo List */}
          <div style={centerCol}>
            <TodoApp todos={todos} getTodos={getTodos} setTodos={setTodosAndSnapshot} filter={getFilter()} setFilter={setFilter} />
          </div>

          <div style={rightCol}>
            <Dashboard todos={todos} history={getHistory()} />
          </div>
        </div>
      </div>
    </div>
  )
}

try {
  mount(<App />, document.getElementById('root')!)
} catch (err: any) {
  // Render a visible error box so we can see runtime errors in the browser
  console.error('App mount error', err)
  const container = document.getElementById('root') || document.body
  const box = document.createElement('pre')
  box.style.position = 'fixed'
  box.style.left = '20px'
  box.style.right = '20px'
  box.style.top = '20px'
  box.style.padding = '12px'
  box.style.background = 'rgba(0,0,0,0.85)'
  box.style.color = 'white'
  box.style.zIndex = '9999'
  box.style.borderRadius = '8px'
  box.style.maxHeight = '60vh'
  box.style.overflow = 'auto'
  box.textContent = String(err && (err.stack || err.message || err))
  container.appendChild(box)
}
