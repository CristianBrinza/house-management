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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  // La montare, verificăm localStorage și setăm user/token
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
    setLoading(false); // Am terminat verificarea inițială
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/login',
        { username, password }
      );
      const { user: loggedUser, token } = res.data;
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(loggedUser);
      navigate('/'); // după login, redirecționează pe Home (sau orice rută protejată)
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
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
