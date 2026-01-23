export interface CourseExamSectionType {
    id: number;
    course_exam_id: number;
    section_name: string;
    duration: number;
    questions?: CourseExamQuestionType[];
}

export interface CourseExamSectionPayload {
    course_exam_id?: number;
    section_name: string;
    duration: number;
}

