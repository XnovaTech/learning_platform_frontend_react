import type { CourseExamType, CourseExamPayload } from '@/types/courseexam';
import api from './api';
import type { UpcomingExamForStudentType } from '@/types/answer';

export const ListCourseExam = async (courseId: number): Promise<CourseExamType[]> => {
  try {
    const { data } = await api.get(`/v1/course-exams/by-course/${courseId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getUpcomingExamForStudent = async (studentId: number): Promise<UpcomingExamForStudentType[]> => {
  try {
    const { data } = await api.get(`/v1/student/upcoming/exams/${studentId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};


export const ListCourseExamWithType = async (courseId: number, examType: string) => {
  try {
    const { data } = await api.get(`/v1/course-exams/${courseId}/exam-types/${examType}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getStudentCourseExam = async (courseId: number): Promise<CourseExamType[]> => {
  try {
    const { data } = await api.get(`/v1/course-exams/by-student/${courseId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const uploadImage = async (payload: FormData) => {
  try {
    const { data } = await api.post('/v1/courses/exam/upload/image', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data?.original;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createCourseExam = async (payload: CourseExamPayload): Promise<CourseExamType> => {
  try {
    const { data } = await api.post('v1/course-exams', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateCourseExam = async (id: number, payload: CourseExamPayload): Promise<CourseExamType> => {
  try {
    const { data } = await api.put(`v1/course-exams/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteExam = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/course-exams/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getCourseExams = async (courseId: number): Promise<CourseExamType[]> => {
  try {
    const { data } = await api.get(`/v1/course-exams/by-course/${courseId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const createCourseExamEntity = async (payload: CourseExamPayload): Promise<CourseExamType> => {
  try {
    const { data } = await api.post('/v1/course-exams', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateCourseExamEntity = async (id: number, payload: CourseExamPayload): Promise<CourseExamType> => {
  try {
    const { data } = await api.put(`/v1/course-exams/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getCourseExamEntity = async (id: number): Promise<CourseExamType> => {
  try {
    const { data } = await api.get(`/v1/course-exams/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteCourseExamEntity = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/course-exams/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
