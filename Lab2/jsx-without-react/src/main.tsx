/** @jsx createElement */
import { createElement, mount, useState } from "./jsx-runtime"
import { Counter } from "./counter"
import { TodoApp } from "./todo-app"
import Dashboard from "./dashboard"

type Filter = 'all' | 'active' | 'completed'
interface Todo { id: number; task: string; done: boolean }

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'flex-start',
  border: '2px solid rgba(255,0,0,0.03)',
  background: 'linear-gradient(180deg,#f6efff,#efe1ff)',
  fontFamily: 'inherit',
  boxSizing: 'border-box' as const,
  paddingTop: '36px',
  paddingBottom: '60px',
}

const contentRow = {
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}

const innerRow = {
  width: '100%',
  maxWidth: '1100px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '28px',
}

const leftCol = {
  width: '300px',
  minWidth: '260px',
  flex: '0 0 300px',
}

const centerCol = {
  flex: '1 1 520px',
  maxWidth: '520px',
  display: 'flex',
  justifyContent: 'center',
}

const rightCol = {
  width: '320px',
  minWidth: '280px',
  flex: '0 0 320px',
  display: 'flex',
  justifyContent: 'flex-start',
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
  fontSize: '72px',
  color: '#6a3ecf',
  fontWeight: 900,
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
}

const App = () => {
  // Initialize todos from localStorage so the dev app matches the file:// fallback behavior
  const loadTodos = (): Todo[] => {
    try {
      const raw = localStorage.getItem('fallbackTodos')
      return raw ? JSON.parse(raw) as Todo[] : []
    } catch (e) {
      return []
    }
  }

  const [getTodos, setTodosRaw] = useState<Todo[]>(loadTodos())
  // Wrap the raw setter so every change is persisted to localStorage
  const setTodos = (t: Todo[]) => {
    try { localStorage.setItem('fallbackTodos', JSON.stringify(t)) } catch (e) {}
    setTodosRaw(t)
  }

  const [getFilter, setFilter] = useState<Filter>('all')

  const todos = getTodos()
  const total = todos.length
  const completed = todos.filter(t => t.done).length

  const leftCard = {
    background: 'white',
    borderRadius: 24,
    padding: '18px',
    marginBottom: 18,
    textAlign: 'center' as const,
    boxShadow: '0 12px 30px rgba(120,80,160,0.06)',
    position: 'relative' as const,
    zIndex: 2,
  }

  const trackCard = {
    background: 'white',
    borderRadius: 20,
    padding: '22px',
    color: '#6a2f84',
    minHeight: 180,
    position: 'relative' as const,
    zIndex: 2,
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
          {/* LEFT: Counter */}
          <div style={leftCol}>
            <div style={leftCard}>
              <Counter initialCount={0} />
            </div>
            <div style={trackCard}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Task list</div>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Completed / Total: {completed} / {total}</div>
            </div>
          </div>

          {/* CENTER: Todo List */}
          <div style={centerCol}>
            <TodoApp
              todos={todos}
              getTodos={getTodos}
              setTodos={setTodos}
              filter={getFilter()}
              setFilter={setFilter}
            />
          </div>

          {/* RIGHT: Dashboard */}
          <div style={rightCol}>
            <Dashboard todos={todos} filter={getFilter()} />
          </div>
        </div>
      </div>
    </div>
  )
}

try {
  mount(<App />, document.getElementById('root')!)
} catch (err: any) {
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
  box.style.borderRadius = '14px'
  box.style.maxHeight = '60vh'
  box.style.overflow = 'auto'
  box.textContent = String(err && (err.stack || err.message || err))
  container.appendChild(box)
}
