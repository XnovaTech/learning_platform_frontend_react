import api from './api';
import type { StudentExamAnswersType, StudentExamSubmitPayload } from '@/types/studentexamanswer';

export const getStudentExamsDetail = async (enrollId: number, examType: string): Promise<StudentExamAnswersType> => {
  try {
    const { data } = await api.get(`/v1/student-exam-answers/details/${enrollId}/${examType}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const submitStudentExamAnswers = async (payload: StudentExamSubmitPayload): Promise<void> => {
  try {
    const data = await api.post('/v1/student-exam-answers', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};
