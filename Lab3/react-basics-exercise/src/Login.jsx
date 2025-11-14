import { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <div className="login-card">
      <header>
        <p className="login-kicker">Welcome back 👋</p>
        <p className="login-subtitle">Sign in to continue your React Lab.</p>
      </header>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </label>

        <button type="submit" className="primary-btn">
          Login
        </button>
      </form>

      <p className="login-hint">Current username: {formData.username || '—'}</p>
    </div>
  );
}

export default Login;
