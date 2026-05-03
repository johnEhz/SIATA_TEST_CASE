import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { setToken, removeToken, getToken } from '../lib/auth';
import { LoginCredentials, RegisterCredentials } from '../types/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/users/login/', credentials);
      const token = response.data.data?.access || response.data.access;
      
      if (token) {
        setToken(token);
        setIsAuthenticated(true);
        router.push('/client/shipments');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Autenticación fallida', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await api.post('/users/register/', credentials);
      return true;
    } catch (error) {
      console.error('Error al registrar usuario', error);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    router.push('/auth/login');
  };


  return { isAuthenticated, login, register, logout };
};
