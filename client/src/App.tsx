// src/App.tsx
import React, { type JSX } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home/Home.tsx';
import Login from './pages/login/Login.tsx';
import Inventory from './pages/inventory/Inventory.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import Use from './pages/use/Use.tsx';
import Cart from './pages/cart/Cart.tsx';
import TypeManagement from './pages/type-management/TypeManagement.tsx';
import Config from './pages/config/Config.tsx';
import Drunked from './pages/drunked/Drunked.tsx';
import Drinks from './pages/drinks/Drinks.tsx';
import DrinkTypes from './pages/drink-types/DrinkTypes.tsx';

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
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/inventory"
            element={<ProtectedRoute element={<Inventory />} />}
          />
          <Route path="/use" element={<ProtectedRoute element={<Use />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />

          {/* setting and config */}
          <Route
            path="/config"
            element={<ProtectedRoute element={<Config />} />}
          />
          <Route
            path="/types"
            element={<ProtectedRoute element={<TypeManagement />} />}
          />
          <Route
            path="/drinks"
            element={<ProtectedRoute element={<Drinks />} />}
          />
          <Route
            path="/drunked"
            element={<ProtectedRoute element={<Drunked />} />}
          />
          <Route
            path="/drink-types"
            element={<ProtectedRoute element={<DrinkTypes />} />}
          />

          {/* Pentru orice altceva, redirecționează la "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
