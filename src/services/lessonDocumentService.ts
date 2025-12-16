import type { LessonDocumentType } from '@/types/lessondocument';
import api from './api';


export const uploadLessonDocument = async (payload: FormData): Promise<LessonDocumentType> => {
  try {
    const { data } = await api.post('/v1/lesson-documents', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteLessonDocument = async (documentId: number): Promise<void> => {
  try {
    await api.delete(`/v1/lesson-documents/${documentId}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
