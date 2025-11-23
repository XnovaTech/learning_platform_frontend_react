import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getUserProfile } from '@/services/authService';
import { toast } from 'sonner';
import type { payloadUser, UserType } from '@/types/user';

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: payloadUser) => Promise<void>;
  logout: () => void;
  fetchProfile: (t: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        fetchProfile(savedToken);
      }
    }
  }, []);

  const fetchProfile = async (t: string) => {
    try {
      const profile = await getUserProfile(t);
      const userData = profile;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    const token = data.data.token;
    const userData = data.data.user;

    setToken(token);
    setUser(userData);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    return data.data.user;
  };

  const register = async (payload: payloadUser) => {
    const data = await registerUser(payload);
    const token = data.data.token;
    const userData = data.data.user;

    setToken(token);
    setUser(userData);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    await fetchProfile(token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged Out successfully');
    navigate('/login');
  };

  const value = useMemo(() => ({ user, token, login, register, logout,fetchProfile }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
