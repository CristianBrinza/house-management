// src/App.tsx
import React, { type JSX } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home/Home.tsx';
import Login from './pages/login/Login.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';


const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { user } = useAuth();
  // dacă user e null → redirecționează la /login, altfel afișează componenta
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta Publică: Login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta Protejată: Home */}
          <Route
            path="/"
            element={<ProtectedRoute element={<Home />} />}
          />

          {/* Pentru orice altceva, redirecționează la "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
