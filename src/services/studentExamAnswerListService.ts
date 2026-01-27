import api from './api';
import type { StudentExamAnswerListRecordType, StudentExamMarkUpdatePayload } from '@/types/studentexamanswer';

export const listStudentExamAnswerRecords = async (courseId: number, classroomId: number): Promise<StudentExamAnswerListRecordType[]> => {
  try {
    const { data } = await api.get(`/v1/students/exam-records/${courseId}/${classroomId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateStudentExamMark = async (payload: StudentExamMarkUpdatePayload): Promise<void> => {
  try {
    const data = await api.post('/v1/student-exam-answers-list/update-score', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const uploadDocument = async (file: File): Promise<{ id: string; html_content: string; filename: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/v1/tudent-exam-answers-list/upload-document', formData);

    return data.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Upload failed';
    throw new Error(message);
  }
};

export const updateDocumentHtml = async (data: { enroll_id: number; exam_id: number; html_content: string }) => {
  try {
    const response = await api.post('/v1/student-exam-answers-list/answers/update-document-html', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
