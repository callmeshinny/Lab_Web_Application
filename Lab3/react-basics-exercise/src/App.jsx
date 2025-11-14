import { useState } from 'react';
import Navbar from './Navbar';
import Card from './Card';
import UserProfile from './UserProfile';
import Counter from './Counter';
import Login from './Login';
import Accordion from './Accordion';
import TodoBoard from './TodoBoard';

const users = [
  {
    name: 'Jane Smith',
    role: 'Product Designer',
    email: 'jane.smith@example.com',
    avatarUrl: '/image/jane.webp',
    imageSize: 90,
  },
  {
    name: 'John Doe',
    role: 'Frontend Engineer',
    email: 'john.doe@example.com',
    avatarUrl: '/image/john.jpg',
    imageSize: 90,
  },
];

const initialTasks = [
  { id: '1', text: 'Learn React', status: 'todo' },
  { id: '2', text: 'Build project', status: 'in-progress' },
  { id: '3', text: 'Style UI', status: 'done' },
];

function App() {
  const [activeTab, setActiveTab] = useState('exercise-34');
  const [tasks, setTasks] = useState(initialTasks);

  const renderContent = () => {
    switch (activeTab) {
      case 'exercise-34':
        return (
          <Card title="Exercise 3 & 4" subtitle="UserProfile with Props">
            <div className="profiles">
              {users.map((user, index) => (
                <UserProfile
                  key={user.email}
                  userData={user}
                  theme={index === 0 ? 'light' : 'dark'}
                />
              ))}
            </div>
          </Card>
        );
      case 'exercise-5':
        return (
          <Card title="Exercise 5" subtitle="Counter (useState)">
            <Counter />
          </Card>
        );
      case 'exercise-6':
        return (
          <Card title="Exercise 6" subtitle="Controlled Login Form">
            <Login />
          </Card>
        );
      case 'exercise-7':
        return (
          <Card title="Exercise 7" subtitle="Accordion and Panel">
            <Accordion />
          </Card>
        );
      case 'exercise-8':
        return (
          <Card title="Exercise 8" subtitle="Capstone Project: Todo Kanban Board">
            <TodoBoard tasks={tasks} onTasksChange={setTasks} />
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <p className="hero-label">UIT Web Lab 03</p>
        <h1>Lab 3 – Introduction to React</h1>
        <p className="hero-subtitle">
          A guided lab touching props, state, controlled forms, lifting state up, and a kanban capstone.
        </p>
        <Navbar activeTab={activeTab} onChange={setActiveTab} />
      </header>
      <main>{renderContent()}</main>
    </div>
  );
}

export default App;
