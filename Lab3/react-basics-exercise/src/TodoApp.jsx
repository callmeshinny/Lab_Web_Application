import { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

// Main To-Do app container
function TodoApp({ todos, setTodos, onTodosChange }) {
  const [filter, setFilter] = useState('All');

  const addTodo = (text) => {
    // Support multiple tasks per line
    const tasks = text.split('\n').filter(task => task.trim());
    const newTodos = tasks.map(task => ({
      id: Date.now() + Math.random(),
      text: task.trim(),
      completed: false,
    }));
    const updatedTodos = [...todos, ...newTodos];
    setTodos(updatedTodos);
    if (onTodosChange) onTodosChange(updatedTodos);
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    if (onTodosChange) onTodosChange(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    if (onTodosChange) onTodosChange(updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'All') return true;
    if (filter === 'In Progress') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-card">
      <h3 className="todo-title">TODO LIST</h3>
      
      <div className="tabs">
        <button 
          className={filter === 'All' ? 'tab active' : 'tab'}
          onClick={() => setFilter('All')}
        >
          All
        </button>
        <button 
          className={filter === 'In Progress' ? 'tab active' : 'tab'}
          onClick={() => setFilter('In Progress')}
        >
          In Progress
        </button>
        <button 
          className={filter === 'Completed' ? 'tab active' : 'tab'}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </button>
      </div>

      <TodoForm addTodo={addTodo} />
      <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </div>
  );
}

export default TodoApp;
