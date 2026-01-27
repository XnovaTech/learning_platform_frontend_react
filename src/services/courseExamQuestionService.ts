import api from './api';
import type { CourseExamQuestionType, CourseExamQuestionPayloadType } from '@/types/courseexamquestion';

export const getCourseExamQuestions = async (sectionId: number): Promise<CourseExamQuestionType[]> => {
  try {
    const { data } = await api.get(`/v1/course-exam-questions/by-section/${sectionId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const createCourseExamQuestion = async (payload: CourseExamQuestionPayloadType): Promise<CourseExamQuestionType> => {
  try {
    const { data } = await api.post('/v1/course-exam-questions', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateCourseExamQuestion = async (id: number, payload: CourseExamQuestionPayloadType): Promise<CourseExamQuestionType> => {
  try {
    const { data } = await api.put(`/v1/course-exam-questions/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteCourseExamQuestion = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/course-exam-questions/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getCourseExamQuestion = async (id: number): Promise<CourseExamQuestionType> => {
  try {
    const { data } = await api.get(`/v1/course-exam-questions/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

// Bulk operations
export const createCourseExamQuestionsBulk = async (payload: CourseExamQuestionPayloadType[]): Promise<CourseExamQuestionType[]> => {
  try {
    const { data } = await api.post('/v1/course-exam-questions/store-bulk', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
