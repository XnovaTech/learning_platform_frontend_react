import type { StudentExamSubmitPayload, StudentExamMarkUpdatePayload, StudentCourseExamTaskRecordType, StudentExamAnswersType, UpcomingExamForStudentType } from '@/types/answer';
import api from './api';

export const getUpcomingExamForStudent = async (studentId: number): Promise<UpcomingExamForStudentType[]> => {
  try {
    const { data } = await api.get(`/v1/student/upcoming/exams/${studentId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const listStudentCourseExamRecords = async (courseId: number, enrollId: number): Promise<StudentCourseExamTaskRecordType[]> => {
  try {
    const { data } = await api.get(`/v1/students/exam/records/${courseId}/${enrollId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getStudentCourseExamDetail = async (enrollId: number, examType: string): Promise<StudentExamAnswersType> => {
  try {
    const { data } = await api.get(`/v1/student/exam/answers/detail/${enrollId}/${examType}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const submitStudentCourseExams = async (payload: StudentExamSubmitPayload): Promise<void> => {
  try {
    const data = await api.post('/v1/student/exam/answers', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateStudentExamMark = async (payload: StudentExamMarkUpdatePayload): Promise<void> => {
  try {
    const data = await api.post('/v1/student/exam/update-score', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteStudentExamRecords = async (enrollId: number): Promise<void> => {
  try {
    await api.delete(`/v1/student/exam/record-delete/${enrollId}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const uploadDocument = async (file: File): Promise<{ id: string; html_content: string; filename: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/v1/student/exam/upload-document', formData);

    return data.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Upload failed';
    throw new Error(message);
  }
};

export const updateDocumentHtml = async (data: { enroll_id: number; exam_id: number; html_content: string }) => {
  try {
    const response = await api.post('/v1/student/exam/answers/update-document-html', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
