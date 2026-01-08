import api from './api';
import type { ClassRoomExamPayloadType, ClassRoomExamType } from '@/types/classexam';

export const listClassRoomExams = async (): Promise<ClassRoomExamType[]> => {
  try {
    const { data } = await api.get(`/v1/classroom-exams`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createClassRoomExam = async (payload: ClassRoomExamPayloadType): Promise<ClassRoomExamType> => {
  try {
    const { data } = await api.post('/v1/classroom-exams', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getClassRoomExam = async (id: number): Promise<ClassRoomExamType> => {
  try {
    const { data } = await api.get(`/v1/classroom-exams/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateClassRoomExam = async (id: number, payload: ClassRoomExamPayloadType): Promise<ClassRoomExamType> => {
  try {
    const { data } = await api.put(`/v1/classroom-exams/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const deleteClassRoomExam = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/classroom-exams/${id}`);
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const getExamsByClassroomId = async (classroomId: number): Promise<ClassRoomExamType[]> => {
  try {
    const { data } = await api.get(`/v1/classroom-exams/classroom/${classroomId}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
