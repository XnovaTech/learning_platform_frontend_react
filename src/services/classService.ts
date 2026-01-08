import api from './api';
import type { ClassRoomPayloadType, ClassRoomType } from '@/types/class';

export const listClasses = async (): Promise<ClassRoomType[]> => {
  try {
    const { data } = await api.get(`/v1/classes`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const createClassRoom = async (payload: ClassRoomPayloadType): Promise<ClassRoomType> => {
  try {
    const { data } = await api.post('/v1/classes', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getClass = async (id: number): Promise<ClassRoomType> => {
  try {
    const { data } = await api.get(`/v1/classes/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateClassRoom = async (id: number, payload: ClassRoomPayloadType): Promise<ClassRoomType> => {
  try {
    const { data } = await api.put(`/v1/classes/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteClassRoom = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/classes/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const finishClass = async (id: number): Promise<void> => {
  try {
    const { data } = await api.put(`/v1/classes/${id}/finish`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteClassConversations = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/classes/${id}/conversation`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getClassesByCategory = async (categoryId: number): Promise<ClassRoomType[]> => {
  try {
    const { data } = await api.get(`/v1/classes/categories/${categoryId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getActiveClassesByTeacher = async (): Promise<ClassRoomType[]> => {
  try {
    const { data } = await api.get(`/v1/classes/teacher/active`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
