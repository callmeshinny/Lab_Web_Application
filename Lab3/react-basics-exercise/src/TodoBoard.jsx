import TodoColumn from './TodoColumn';
import TodoForm from './TodoForm';

const columnDefinitions = [
  { id: 'todo', title: 'Todo', color: 'peach' },
  { id: 'in-progress', title: 'In Progress', color: 'mint' },
  { id: 'done', title: 'Done', color: 'sky' },
];

function TodoBoard({ tasks, onTasksChange }) {
  const addTask = (text) => {
    if (!text.trim()) return;
    const newTask = {
      id: `${Date.now()}-${Math.random()}`,
      text: text.trim(),
      status: 'todo',
    };
    onTasksChange([newTask, ...tasks]);
  };

  const moveTask = (taskId, direction) => {
    const updated = tasks.map((task) => {
      if (task.id !== taskId) return task;
      if (direction === 'forward') {
        if (task.status === 'todo') return { ...task, status: 'in-progress' };
        if (task.status === 'in-progress') return { ...task, status: 'done' };
      }
      if (direction === 'backward') {
        if (task.status === 'done') return { ...task, status: 'in-progress' };
        if (task.status === 'in-progress') return { ...task, status: 'todo' };
      }
      return task;
    });
    onTasksChange(updated);
  };

  const deleteTask = (taskId) => {
    onTasksChange(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="todo-board">
      <TodoForm onSubmit={addTask} />
      <div className="todo-columns">
        {columnDefinitions.map((column) => (
          <TodoColumn
            key={column.id}
            column={column}
            tasks={tasks.filter((task) => task.status === column.id)}
            onMove={moveTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoBoard;

