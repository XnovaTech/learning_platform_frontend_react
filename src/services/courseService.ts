import type { CourseListResponse, CoursePayloadType, CourseType } from '@/types/course';
import api from './api';

export const listCourses = async (form?: Partial<CoursePayloadType>): Promise<CourseListResponse> => {
  try {
    const { data } = await api.get('/v1/courses', { params: form });
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCourseWithClass = async (): Promise<CourseType[]> => {
  try {
    const { data } = await api.get('/v1/course/classes');
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createCourse = async (payload: CoursePayloadType): Promise<CourseType> => {
  try {
    const { data } = await api.post('/v1/courses', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateCourse = async (id: number, payload: CoursePayloadType): Promise<CourseType> => {
  try {
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      payload.append('_method', 'PUT');
      const { data } = await api.post(`/v1/courses/${id}`, payload);
      return data?.data;
    }
    const { data } = await api.put(`/v1/courses/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteCourse = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/courses/${id}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCourse = async (id: number): Promise<CourseType> => {
  try {
    const { data } = await api.get(`/v1/courses/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCoursewithClassesAndLessonName = async (id: number): Promise<CourseType> => {
  try {
    const { data } = await api.get(`/v1/course/all/detail/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
