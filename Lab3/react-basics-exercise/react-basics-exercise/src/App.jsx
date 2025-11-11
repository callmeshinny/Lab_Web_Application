import { useState } from 'react';
import TodoApp from './TodoApp';
import Dashboard from './Dashboard';

function App() {
  const [todos, setTodos] = useState([]);

  return (
    <div className="app-container">
      <h1 className="app-title">React Basics</h1>
      <div className="cards-container">
        <TodoApp todos={todos} setTodos={setTodos} />
        <Dashboard todos={todos} />
      </div>
    </div>
  );
}

export default App;
