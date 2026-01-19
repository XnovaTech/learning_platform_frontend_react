import type { PayloadUser } from '@/types/user';
import api from './api';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const registerUser = async (payload: PayloadUser) => {
  try {
    const response = await api.post('/auth/register', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getUserProfile = async (token: string) => {
  try {
    const response = await api.get('/auth/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response?.data?.data.user;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
