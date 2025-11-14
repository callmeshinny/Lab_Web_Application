import TodoItem from './TodoItem';

function TodoColumn({ column, tasks, onMove, onDelete }) {
  return (
    <section className={`todo-column ${column.color}`}>
      <header>
        <h3>{column.title}</h3>
        <span>{tasks.length}</span>
      </header>

      <div className="todo-column-body">
        {tasks.length === 0 && <p className="empty-column">No tasks</p>}
        {tasks.map((task) => (
          <TodoItem key={task.id} task={task} onMove={onMove} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

export default TodoColumn;

