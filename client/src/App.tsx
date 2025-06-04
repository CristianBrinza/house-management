// src/App.tsx
import React, { type JSX } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home/Home.tsx';
import Login from './pages/login/Login.tsx';
import Inventory from './pages/inventory/Inventory.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useAuth();

  // Dacă încă se verifică localStorage sau token, nu redirecționăm încă
  if (loading) {
    return null; // sau un <div>Loading...</div>
  }

  // După ce loading e false:
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta Publică: Login */}
          <Route path="/login" element={<Login />} />

          {/* Rute Protejate */}
          <Route
            path="/"
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route
            path="/inventory"
            element={<ProtectedRoute element={<Inventory />} />}
          />

          {/* Pentru orice altceva, redirecționează la "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
