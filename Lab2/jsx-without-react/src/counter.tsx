/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime"

interface CounterProps {
  initialCount?: number
}

const Counter = ({ initialCount = 0 }: CounterProps) => {
  const [getCount, setCount] = useState(initialCount)

  // 🎨 Box style – giữ nguyên form cũ, chỉ đổi vị trí
  const containerStyle = {
    // normal flow card (not absolute/fixed) so it scrolls with the page
    position: "relative" as const,
    margin: "0 auto 12px",
    background: "linear-gradient(180deg,#f6ecff,#efe0ff)",
    padding: "36px 40px",
    borderRadius: "16px",
    boxShadow: "0 20px 50px rgba(120,80,160,0.10)",
    textAlign: "center" as const,
  }

  const h2Style = {
    margin: 0,
    color: "#3b0b5f",
    fontWeight: 800,
    fontSize: '18px',
    letterSpacing: '1px',
  }

  const countStyle = {
    margin: "10px 0 16px 0",
    color: "#3b0b5f",
    fontWeight: 800,
    fontSize: '20px',
  }

  const buttons = {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  }

  const smallCircle = {
    background: '#ecd6ff',
    color: '#6a3ecf',
    border: 'none',
    width: 44,
    height: 44,
    borderRadius: 999,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 18px rgba(120,80,160,0.06)'
  }

  const resetBtn = {
    background: '#ffdfe8',
    color: '#a23f88',
    border: 'none',
    padding: '8px 18px',
    borderRadius: 12,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(120,80,160,0.06)'
  }

  return (
    <div style={containerStyle}>
      <h2 style={h2Style}>COUNTER POP-UP</h2>
      <p style={countStyle}>Count: {getCount()}</p>
      <div style={{ ...buttons, alignItems: 'center' }}>
        <button
          style={smallCircle}
          onMouseDown={(e: any) => e.preventDefault()}
          onClick={() => setCount(getCount() - 1)}
        >
          -
        </button>

        <div style={{ width: 18 }} />

        <button
          style={resetBtn}
          onMouseDown={(e: any) => e.preventDefault()}
          onClick={() => setCount(0)}
        >
          RESET
        </button>

        <div style={{ width: 18 }} />

        <button
          style={smallCircle}
          onMouseDown={(e: any) => e.preventDefault()}
          onClick={() => setCount(getCount() + 1)}
        >
          +
        </button>
      </div>
    </div>
  )
}

export { Counter }
