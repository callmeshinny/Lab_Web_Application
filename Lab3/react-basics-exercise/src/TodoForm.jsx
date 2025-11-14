import { useState } from 'react';

function TodoForm({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add new task..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" className="add-btn">
        Add
      </button>
    </form>
  );
}

export default TodoForm;
