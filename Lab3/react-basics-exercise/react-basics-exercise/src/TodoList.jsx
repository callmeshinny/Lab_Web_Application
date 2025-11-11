import TodoItem from './TodoItem';

// List all todos
function TodoList({ todos, toggleTodo, deleteTodo }) {
  return (
    <div className="todo-list-container">
      <div className="todo-list-header">
        <span>Task</span>
        <span>Done</span>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
