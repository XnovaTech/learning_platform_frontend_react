import api from './api';
import type { CourseExamSectionType, CourseExamSectionPayload } from '@/types/courseexamsection';

export const getCourseExamSections = async (courseExamId: number): Promise<CourseExamSectionType[]> => {
  try {
    const { data } = await api.get(`/v1/course-exam-sections/by-exam/${courseExamId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const createCourseExamSection = async (payload: CourseExamSectionPayload): Promise<CourseExamSectionType> => {
  try {
    const { data } = await api.post('/v1/course-exam-sections', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateCourseExamSection = async (id: number, payload: CourseExamSectionPayload): Promise<CourseExamSectionType> => {
  try {
    const { data } = await api.put(`/v1/course-exam-sections/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteCourseExamSection = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/course-exam-sections/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getCourseExamSection = async (id: number): Promise<CourseExamSectionType> => {
  try {
    const { data } = await api.get(`/v1/course-exam-sections/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const reorderCourseExamSectoins = async (payload: {
  sections: {id: number; order: number} [];
}) => {
  const {data} = await api.post('/v1/course-exam-sections/data/reorder', payload);
  return data;
}
