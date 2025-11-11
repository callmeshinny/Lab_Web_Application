import { useState } from 'react';

// Controlled form to add new todos
function TodoForm({ addTodo }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    // Enter without Shift = submit, Shift+Enter = new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) {
        addTodo(text);
        setText('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task... (one per line)"
        rows="3"
        className="todo-input"
      />
      <button type="submit" className="add-button">Add</button>
    </form>
  );
}

export default TodoForm;
