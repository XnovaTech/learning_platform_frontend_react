import type { ExamAnswerDocumentType } from '@/types/examanswerdocument';
import api from './api';


export const uploadExamAnswerDocument = async (payload: FormData): Promise<ExamAnswerDocumentType> => {
  try {
    const { data } = await api.post('/v1/exam-answer-documents', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteExamAnswerDocument = async (documentId: number): Promise<void> => {
  try {
    await api.delete(`/v1/exam-answer-documents/${documentId}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
