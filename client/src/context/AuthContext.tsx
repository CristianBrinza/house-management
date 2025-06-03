// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // La montare, verificăm dacă există user salvat în localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // setează token-ul în axios, ca header implicit
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/login',
        { username, password }
      );
      const { user: loggedUser, token } = res.data;
      // salvează în localStorage
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('token', token);
      // setează header-ul Authorization pentru toate request-urile viitoare
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(loggedUser);
      navigate('/'); // după login, redirecționează pe Home
    } catch (err) {
      console.error(err);
      alert('Credențiale invalide');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
