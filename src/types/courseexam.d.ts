export type ExamType = 'Midterm' | 'Final';

export interface CourseExamType {
    id: number;
    course_id: number;
    exam_type: ExamType;
    intro: string | null;
    total_duration: number;
    sections?: CourseExamSectionType[];
}

export interface CourseExamPayload {
    course_id: number;
    exam_type: ExamType;
    intro?: string;
    total_duration: number;
}

