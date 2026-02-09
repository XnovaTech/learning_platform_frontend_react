import api from './api';
import type { StudentExamReviewNote, StudentExamReviewNotePayload } from '@/types/studentexamreviewnote';

export const createStudentExamReviewNote = async (payload: StudentExamReviewNotePayload): Promise<StudentExamReviewNote> => {
  try {
    const { data } = await api.post('/v1/student-exam-review-notes', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateStudentExamReviewNote = async (id: number, payload: StudentExamReviewNotePayload): Promise<StudentExamReviewNote> => {
  try {
    const { data } = await api.put(`/v1/student-exam-review-notes/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const listStudentExamReviewNotes = async (): Promise<StudentExamReviewNote[]> => {
  try {
    const { data } = await api.get('/v1/student-exam-review-notes');
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteStudentExamReviewNote = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/student-exam-review-notes/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const uploadStudentExamReviewNoteImage = async (formData: FormData): Promise<{ url: string }> => {
  try {
    const response = await api.post('/v1/student-exam-review-notes/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
