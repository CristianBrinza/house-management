// src/pages/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>

        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          placeholder="username"
          className={styles.input}
        />

        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="password"
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
