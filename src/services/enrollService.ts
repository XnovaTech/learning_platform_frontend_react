import type { EnrollType, EnrollPayloadType } from '@/types/enroll';
import api from './api';

export const listsEnrolls = async (form?: Partial<EnrollPayloadType>): Promise<any> => {
  try {
    const { data } = await api.get('/v1/enrollments', { params: form });
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createEnroll = async (payload: EnrollPayloadType): Promise<EnrollType> => {
  try {
    const { data } = await api.post('/v1/enrollments', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const enrollDetail = async (enrollId: Number): Promise<EnrollType> => {
  try {
    const { data } = await api.get(`/v1/enrollments/${enrollId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateEnroll = async (id: number, payload: any): Promise<any> => {
  try {
    const { data } = await api.put(`/v1/enrollments/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteEnroll = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/enrollments/${id}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
