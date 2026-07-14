import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('salon_token');
    const userData = localStorage.getItem('salon_user');
    if (token && userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, []);
  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    const { token, ...userData } = data.data;
    localStorage.setItem('salon_token', token);
    localStorage.setItem('salon_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };
  const logout = () => { localStorage.removeItem('salon_token'); localStorage.removeItem('salon_user'); setUser(null); };
  const hasRole = (role) => user?.roles?.includes('ROLE_' + role);
  return <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
