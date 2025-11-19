import api from './api';
import type { ClassRoomPayloadType, ClassRoomType } from '@/types/class';

export const listClasses = async (): Promise<ClassRoomType[]> => {
  try {
    const { data } = await api.get(`/v1/classes`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createClassRoom = async (payload: ClassRoomPayloadType): Promise<ClassRoomType> => {
  try {
    const { data } = await api.post('/v1/classes', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getClass = async (id: number): Promise<ClassRoomType> => {
  try {
    const { data } = await api.get(`/v1/classes/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateClassRoom = async (id: number, payload: ClassRoomPayloadType): Promise<ClassRoomType> => {
  try {
    const { data } = await api.put(`/v1/classes/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteClassRoom = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/classes/${id}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
