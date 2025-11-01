/** @jsx createElement */
import { createElement } from "./jsx-runtime"

// ===== Card =====
interface CardProps {
  title?: string
  children?: any
  className?: string
  onClick?: () => void
}

const Card = ({ title, children, className, onClick }: CardProps) => {
  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "18px 22px",
    boxShadow: "0 20px 50px rgba(120,80,160,0.09)",
    position: 'relative' as const,
    zIndex: 2,
  }
  return (
    <div className={className} style={cardStyle} onClick={onClick}>
      {title && <h3 style={{ color: "#3b0b5f", marginBottom: "12px", fontSize: 16, fontWeight: 900 }}>{title}</h3>}
      <div>{children}</div>
    </div>
  )
}

// ===== Modal =====
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: any
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null
  const overlay = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 2000,
  }
  const box = {
    position: "relative" as const,
    background: "white", borderRadius: "20px", padding: "24px 32px",
    width: "400px", boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
  }
  const closeStyle = {
    position: "absolute" as const, top: "10px", right: "16px",
    cursor: "pointer", fontWeight: 800, color: "#a67bff",
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e: any) => e.stopPropagation()}>
        {title && <h2 style={{ color: "#6a3ecf" }}>{title}</h2>}
        <span style={closeStyle} onClick={onClose}>✕</span>
        <div>{children}</div>
      </div>
    </div>
  )
}

// ===== Form =====
interface FormProps {
  onSubmit: (e: Event) => void
  children?: any
  className?: string
}

const Form = ({ onSubmit, children, className }: FormProps) => (
  <form
    className={className}
    onSubmit={(e: any) => {
      e.preventDefault()
      onSubmit(e)
    }}
  >
    {children}
  </form>
)

// ===== Input =====
interface InputProps {
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

const Input = ({ type = "text", value, onChange, placeholder, className }: InputProps) => {
  const inputStyle = {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "2px solid #d5bfff",
    outline: "none",
    fontSize: "15px",
  }
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      className={className}
      style={inputStyle}
      onInput={(e: any) => onChange(e.target.value)}
    />
  )
}

export { Card, Modal, Form, Input }
