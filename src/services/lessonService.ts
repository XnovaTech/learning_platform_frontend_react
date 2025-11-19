import type { LessonType, LessonPayloadType } from '@/types/lesson';
import api from './api';

export const listLessons = async (): Promise<LessonType[]> => {
  try {
    const { data } = await api.get(`/v1/lessons`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createLesson = async (payload: LessonPayloadType): Promise<LessonType> => {
  try {
    const { data } = await api.post('/v1/lessons', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateLesson = async (id: number, payload: LessonPayloadType): Promise<LessonType> => {
  try {
    const { data } = await api.put(`/v1/lessons/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const unlockLesson = async (lessonId: number, classroomId: number): Promise<LessonType> => {
  try {
    const { data } = await api.post(`/v1/lessons/${lessonId}/unlock/${classroomId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteLesson = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/lessons/${id}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const lessonDetail = async (lessonId: Number): Promise<LessonType> => {
  try {
    const { data } = await api.get(`/v1/lessons/${lessonId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
