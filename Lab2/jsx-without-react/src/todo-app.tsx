/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime"

interface Todo {
  id: number
  task: string
  done: boolean
}

type Filter = 'all' | 'active' | 'completed'

interface TodoAppProps {
  todos: Todo[]
  getTodos: () => Todo[]
  setTodos: (t: Todo[]) => void
  filter: Filter
  setFilter: (f: Filter) => void
}

const TodoApp = ({ todos, getTodos, setTodos, filter, setFilter }: TodoAppProps) => {

  // Draft holds the current textarea content (multiple lines).
  const [getDraft, setDraft] = useState<string>("")

  const addTodo = (e: any) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const ta = form.querySelector('textarea') as HTMLTextAreaElement | null
    const raw = getDraft().trim() || (ta ? ta.value.trim() : "")
    if (!raw) return
  // Split by newlines and add each non-empty line as a separate todo
    const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    if (lines.length === 0) return
    const now = Date.now()
    const newItems: Todo[] = lines.map((l, i) => ({ id: now + i, task: l, done: false }))
  // Use getTodos() to read freshest state and append
    const current = getTodos()
    setTodos([...current, ...newItems])
  // Clear draft and textarea DOM value (we keep textarea uncontrolled for stable typing)
    setDraft("")
    if (ta) { ta.value = ""; ta.style.height = '' }
  }

  const toggleDone = (id: number) => {
  const current = getTodos()
  setTodos(current.map((todo: Todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }

  const deleteTodo = (id: number) => {
  const current = getTodos()
  setTodos(current.filter((todo: Todo) => todo.id !== id))
  }

  const container = {
    background: 'white',
    borderRadius: '14px',
    padding: '26px 28px',
    boxShadow: '0 18px 40px rgba(120,80,160,0.06)',
    width: '100%',
    maxWidth: '420px',
    fontFamily: 'Poppins, sans-serif',
  }

  const addRow = {
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
  }

  const input = {
    flex: 1,
    padding: '12px 14px',
    border: '2px solid #efe1ff',
    borderRadius: '14px',
    fontSize: '15px',
    outline: 'none',
    boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.02)',
    transition: 'border 0.2s ease',
  }

  const addBtn = {
    background: '#8f63ff',
    color: 'white',
    border: 'none',
    padding: '10px 12px',
    borderRadius: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    minWidth: 56,
    height: 44,
  }

  const table = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '8px',
  }

  const th = {
    textAlign: "left" as const,
    borderBottom: '2px solid #f2e9ff',
    padding: '14px 8px',
    color: '#3b0b5f',
  }

  const td = {
    padding: '14px 8px',
    borderBottom: '1px solid #faf3ff',
    color: '#3b0b5f',
  }

  

  const visibleTodos = todos.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'completed') return t.done
    return true
  })

  return (
    <div style={container}>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <h2 style={{ margin: 0, color: '#c94a6a', fontSize: '30px', fontWeight: 900, letterSpacing: '1px' }}>TODO LIST</h2>
      </div>

      <form onSubmit={addTodo} style={addRow}>
        <textarea
          placeholder="Add a new task... (one per line)"
          style={{ ...input, resize: 'none', minHeight: 44, maxHeight: 240, padding: '12px 14px', overflow: 'hidden' }}
          onInput={(e: any) => {
            const ta = e.target as HTMLTextAreaElement
            // Auto grow
            ta.style.height = 'auto'
            ta.style.height = ta.scrollHeight + 'px'
            setDraft(ta.value)
          }}
          onKeyDown={(e: any) => {
            // Enter = submit current line; Shift+Enter inserts newline
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
              e.preventDefault()
              const ta = e.target as HTMLTextAreaElement
              const val = ta.value || ''
              const selStart = ta.selectionStart ?? 0
              // Find current line boundaries
              let lineStart = val.lastIndexOf('\n', Math.max(0, selStart - 1))
              lineStart = lineStart === -1 ? 0 : lineStart + 1
              let lineEnd = val.indexOf('\n', selStart)
              if (lineEnd === -1) lineEnd = val.length
              const line = val.slice(lineStart, lineEnd).trim()
              if (!line) return
              const now = Date.now()
              // Append to freshest todos via getTodos to avoid stale closure
              const current = getTodos()
              setTodos([...current, { id: now, task: line, done: false }])
              // Remove the submitted line from textarea
              const before = lineStart === 0 ? '' : val.slice(0, lineStart)
              const after = lineEnd < val.length ? val.slice(lineEnd + 1) : ''
              const newVal = (before + (before && after ? '\n' : '') + after).replace(/^\n/, '')
              ta.value = newVal
              setDraft(newVal)
              // Adjust height
              ta.style.height = 'auto'
              ta.style.height = (ta.scrollHeight || 44) + 'px'
            }
          }}
          onFocus={(e: any) => (e.target.style.border = '2px solid #8f63ff')}
          onBlur={(e: any) => (e.target.style.border = '2px solid #c8aaff')}
        />
        <button style={addBtn} type="submit">Add</button>
      </form>

      

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Task</th>
            <th style={th}>Done</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          
          {visibleTodos.map(todo => {
            const isDone = todo.done

            const taskStyle: Record<string, any> = {
              ...td,
              textDecoration: isDone ? "line-through" : "none",
              color: isDone ? "#999" : "#3b0b5f",
              fontStyle: isDone ? "normal" : "normal",
              transition: "color 160ms ease, text-decoration 160ms ease",
            }

            const checkboxStyle: Record<string, any> = {
              accentColor: '#a67bff',
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              margin: '0',
            }

            const delStyle: Record<string, any> = {
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '16px',
              color: isDone ? '#bfa4e6' : '#a67bff',
              padding: '6px 8px',
              borderRadius: 8,
              transition: 'color 160ms ease',
            }

            return (
              <tr key={todo.id}>
                <td style={taskStyle}>{todo.task}</td>
                <td style={{ ...td, width: '80px', textAlign: 'center' as const }}>
                  <input type="checkbox" checked={isDone} onChange={(e: any) => { e.stopPropagation(); toggleDone(todo.id) }} style={checkboxStyle} />
                </td>
                <td style={{ ...td, width: '50px', textAlign: 'center' as const }}>
                  <button onClick={(e: any) => { e.stopPropagation(); deleteTodo(todo.id) }} style={delStyle}>🗑️</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export { TodoApp }
