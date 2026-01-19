import type { PayloadUser, UpdateUserRequest, UserType } from '@/types/user';
import api from './api';

export const listTeachers = async (): Promise<any[]> => {
  try {
    const { data } = await api.get(`/v1/teachers`);
    return data?.data ?? [];
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const listStudents = async (): Promise<any[]> => {
  try {
    const { data } = await api.get(`/v1/students`);
    return data?.data ?? [];
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const listUsers = async (form?: Partial<PayloadUser>): Promise<any> => {
  try {
    const { data } = await api.get('/v1/users', { params: form });
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateUser = async (id: number, payload: PayloadUser): Promise<any> => {
  try {
    const { data } = await api.put(`/v1/users/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateProfile = async (id: number, payload: UpdateUserRequest): Promise<UserType> => {
  try {
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      payload.append('_method', 'PUT');
      const { data } = await api.post(`/v1/users/${id}`, payload);
      return data?.data;
    }
    const { data } = await api.put(`/v1/users/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/users/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
