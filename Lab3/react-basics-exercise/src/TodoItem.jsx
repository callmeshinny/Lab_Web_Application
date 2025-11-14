function TodoItem({ task, onMove, onDelete }) {
  return (
    <article className="todo-card">
      <p>{task.text}</p>
      <div className="todo-card-actions">
        {task.status !== 'todo' && (
          <button className="pill-btn" onClick={() => onMove(task.id, 'backward')}>
            Back
          </button>
        )}
        {task.status !== 'done' && (
          <button className="pill-btn primary" onClick={() => onMove(task.id, 'forward')}>
            {task.status === 'in-progress' ? 'Done' : 'Move'}
          </button>
        )}
        <button className="pill-btn danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TodoItem;
