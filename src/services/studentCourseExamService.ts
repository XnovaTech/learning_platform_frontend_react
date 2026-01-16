import type { StudentExamSubmitPayload, StudentExamMarkUpdatePayload, StudentCourseExamTaskRecordType, StudentExamAnswersType } from "@/types/answer";
import api from "./api";

export const listStudentCourseExamRecords = async (courseId: number, enrollId: number): Promise<StudentCourseExamTaskRecordType[]> => {
    try {
        const {data} = await api.get(`/v1/students/exam/records/${courseId}/${enrollId}`);
        return data?.data;
    } catch (error: any){
        throw new Error(error.response.data.message || error.message);
    }
}

export const getStudentCourseExamDetail = async (enrollId: number) : Promise<StudentExamAnswersType> => {
    try {
        const {data} = await api.get(`/v1/student/exam/answers/detail/${enrollId}`);
        return data?.data;
    } catch (error: any){
        throw new Error(error.response.data.message || error.message);
    }
}

export const submitStudentCourseExams = async (payload: StudentExamSubmitPayload): Promise<void> => {
    try {
        const data = await api.post('/v1/student/exam/answers', payload);
        return data?.data;
    } catch (error: any){
        throw new Error(error.response.data.message || error.message);
    }
}

export const updateStudentExamMark = async (payload: StudentExamMarkUpdatePayload): Promise<void> => {
    try {
        const data = await api.post('/v1/student/exam/update-score', payload);
        return data?.data;
    } catch (error:any){
        throw new Error(error.response.data.message || error.message);;
    }
}

export const deleteStudentExamRecords = async (enrollId: number): Promise<void> => {
    try {
        await api.delete(`/v1/student/exam/record-delete/${enrollId}`)
    } catch (error: any){
        throw new Error(error.response.data.message || error.message);;
    }
}
