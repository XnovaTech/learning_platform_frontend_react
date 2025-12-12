import type { CreateLessonTaskPayloadType, UpdateLessonTaskPayloadType, LessonTaskType } from "@/types/task";
import api from "./api";
import type { StudentLessonSubmitPayload } from "@/types/answer";

export const listLessonTasks = async (lessonId: number): Promise<LessonTaskType[]> => {
    try {
        const {data} = await api.get(`/v1/lesson/tasks/by-lesson/${lessonId}`);
        return data?.data;
    } catch (error: any){
        throw new Error(error.message);
    }
}

export const getStudentLessonTasks = async (lessonId: number): Promise<LessonTaskType[]> => {
    try {
        const {data} = await api.get(`/v1/lesson/tasks/by-student/${lessonId}`);
        return data?.data;
    } catch (error: any){
        throw new Error(error.message);
    }
}

export const createLessonTask = async (payload: CreateLessonTaskPayloadType): Promise<LessonTaskType> => {
    try {
        const {data} = await api.post('v1/lesson/tasks', payload);
        return data?.data;
    } catch (error: any){
        throw new Error(error.message);
    }
};

export const updateLessonTask = async (id: number, payload: UpdateLessonTaskPayloadType): Promise<LessonTaskType> => {
    try {
        const {data} = await api.put(`v1/lesson/tasks/${id}`, payload);
        return data?.data;
    } catch (error: any){
        throw new Error(error.message);
    }
};

export const deleteTask = async (id: number): Promise<void> => {
    try {
        await api.delete(`/v1/lesson/tasks/${id}`);
    } catch (error: any){
        throw new Error(error.message);
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
