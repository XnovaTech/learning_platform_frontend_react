import type { CreateCourseExamPayloadType, UpdateCourseExamPayloadType, CourseExamType } from "@/types/task";
import api from "./api";

export const ListCourseExam = async (courseId: number): Promise<CourseExamType[]> => {
    try {
        const {data} = await api.get(`/v1/course/exams/by-lesson/${courseId}`);
        return data?.data;
    } catch(error: any){
        throw new Error(error.response.data.message || error.message);
    }
}

export const getStudentCourseExam = async (courseId: number): Promise<CourseExamType[]> => {
    try {
        const {data} = await api.get(`/v1/course/exams/by-student/${courseId}`);
        return data?.data;
    } catch (error: any){
        throw new Error(error.response.data.message || error.message);
    }
}

export const uploadImage = async (payload: FormData) => {
    try {
        const {data} = await api.post('/v1/courses/exam/upload/image', payload, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
        return data?.data?.original
    } catch (error: any){
        throw new Error(error.message)
    }
}

export const createCourseExam = async (payload: CreateCourseExamPayloadType): Promise<CourseExamType> => {
    try {
        const {data} = await api.post('v1/course/exams', payload);
        return data?.data;
    } catch (error: any){
        throw new Error(error.response.data.message || error.message);
    }
};

export const updateCourseExam = async (id: number, payload: UpdateCourseExamPayloadType): Promise<CourseExamType> => {
    try {
        const {data} = await api.put(`v1/course/exams/${id}`, payload);
        return data?.data;
    } catch (error: any){
        throw new Error(error.response.data.message || error.message);
    }
};

export const deleteExam = async (id: number): Promise<void> => {
    try {
        await api.delete(`/v1/course/exams/${id}`);
    } catch (error: any){
        throw new Error(error.response.data.message || error.message);
    }
}