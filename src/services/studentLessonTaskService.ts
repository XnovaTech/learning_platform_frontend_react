import type { StudentsLessonTaskRecordType } from "@/types/answer";
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