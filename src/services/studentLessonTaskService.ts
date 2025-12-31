import type { StudentLessonSubmitPayload, StudentMarkUpdatePayload, StudentsLessonTaskRecordType } from "@/types/answer";
import api from './api';

export const listStudentsLessonTaskRecords = async (classRoomId: number, lessonId: number): Promise<StudentsLessonTaskRecordType[]> => {
    try {
        const {data} = await api.get(`/v1/students/lesson/tasks/records/${classRoomId}/${lessonId}`);
        return data?.data;
    } catch (error: any){
        throw new Error(error.message)
    }
}

export const getStudentLessonRecordDetail = async (enrollId: number, lessonId:number) => {
    try {
        const {data} = await api.get(`/v1/student/lesson/task/detail/${enrollId}/${lessonId}`);
        return data?.data;
    } catch (error: any){
        throw new Error(error.message)
    }
}

export const submitStudentLessonTasks = async (payload: StudentLessonSubmitPayload): Promise<void> => {
    try {
       const data = await api.post('/v1/student/lesson/answers', payload);
        return data?.data;
    } catch (error: any){
        throw new Error(error.message);
    }
}

export const updateStudentMark = async (payload: StudentMarkUpdatePayload): Promise<void> => {
    try {
        const data = await api.post('/v1/student/lesson/update-score', payload);
        return data?.data;
    } catch (error: any){
        throw new Error(error.message);
    }
}

export const deleteStudentRecords = async (enrollId: number, lessonId: number): Promise<void> => {
    try {   
        await api.delete(`/v1/student/lesson/task-delete/${enrollId}/${lessonId}`)
    } catch (error: any) {
        throw new Error(error.message);
    }
}