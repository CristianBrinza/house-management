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

  // La montare, verificăm dacă există token și îl validăm
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      // Setăm header pentru toate request-urile
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Verificăm token-ul la backend
      axios
        .get(import.meta.env.VITE_API_URL + '/api/auth/me')
        .then(res => {
          const { id, username } = res.data;
          setUser({ id, username });
          setLoading(false);
        })
        .catch(err => {
          console.warn('❌ Token invalid la startup:', err);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
          setLoading(false);
          navigate('/login', { replace: true });
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

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
      navigate('/', { replace: true });
    } catch (err) {
      console.error('❌ Eroare la login:', err);
      alert('Credențiale invalide');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
