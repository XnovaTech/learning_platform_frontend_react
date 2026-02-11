import api from './api';
import type { StudentExamAnswers, StudentExamAnswersType, StartExamPayload } from '@/types/studentexamanswer';

export const getStudentExamsDetail = async (enrollId: number, examType: string): Promise<StudentExamAnswersType> => {
  try {
    const { data } = await api.get(`/v1/student-exam-answers/details/${enrollId}/${examType}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const StartExam = async (payload: StartExamPayload): Promise<any> => {
  try {
    const data = await api.post('/v1/student-exam-answers', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};




export const updateExamAnswer = async (id: number, payload: { review?: string; status?: string }): Promise<StudentExamAnswers> => {
  try {
    const { data } = await api.put(`/v1/student-exam-answers/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};



