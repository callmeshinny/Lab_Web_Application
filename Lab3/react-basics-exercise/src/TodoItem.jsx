// Capstone

// Display single todo
function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <li className="todo-item">
      <span className="todo-text">{todo.text}</span>
      <div className="todo-actions">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="todo-checkbox"
        />
        <button onClick={() => deleteTodo(todo.id)} className="delete-button">
          🗑️
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
