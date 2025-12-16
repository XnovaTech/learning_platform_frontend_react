import type { LessonType, LessonPayloadType, LessonLockType } from '@/types/lesson';
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

export const uploadLessonDescriptionImage = async (payload: FormData) => {
  try {
    const {data} = await api.post('/v1/lessons/upload-description-image', payload , {
        headers: {'Content-Type': 'multipart/form-data'},
    });
    return data?.data?.original;
  } catch (error: any){
    throw new Error(error.message);
  }
}

export const updateLockState = async ({ lessonId, classroomId, is_locked }: LessonLockType): Promise<LessonType> => {
  try {
    const { data } = await api.post(`/v1/lessons/${lessonId}/lock-state/${classroomId}`, { locked: is_locked });
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

export const getLessonByStudent = async (lessonId: Number): Promise<LessonType> => {
  try {
    const { data } = await api.get(`/v1/lessons/student/${lessonId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};