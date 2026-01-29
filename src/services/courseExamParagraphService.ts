import api from './api';
import type { CourseExamParagraphType, CourseExamParagraphPayloadType } from '@/types/courseexamparagraph';

export const getCourseExamParagraphs = async (sectionId: number): Promise<CourseExamParagraphType[]> => {
  try {
    const { data } = await api.get(`/v1/course-exam-paragraphs/by-section/${sectionId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const createCourseExamParagraph = async (payload: CourseExamParagraphPayloadType): Promise<CourseExamParagraphType> => {
  try {
    const { data } = await api.post('/v1/course-exam-paragraphs', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateCourseExamParagraph = async (id: number, payload: CourseExamParagraphPayloadType): Promise<CourseExamParagraphType> => {
  try {
    const { data } = await api.put(`/v1/course-exam-paragraphs/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteCourseExamParagraph = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/course-exam-paragraphs/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getCourseExamParagraph = async (id: number): Promise<CourseExamParagraphType> => {
  try {
    const { data } = await api.get(`/v1/course-exam-paragraphs/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const uploadParagraphImage = async (formData: FormData): Promise<{ url: string }> => {
  try {
    const { data } = await api.post('/v1/course-exam-paragraphs/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data?.data?.original;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
