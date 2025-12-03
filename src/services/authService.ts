import type { PayloadUser } from '@/types/user';
import api from './api';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (payload: PayloadUser) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const getUserProfile = async (token: string) => {
  const response = await api.get('/auth/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data?.data.user;
};
