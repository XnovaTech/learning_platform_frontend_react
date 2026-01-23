export interface CourseExamSectionType {
    id: number;
    course_exam_id: number;
    section_name: string;
    duration: number;
    questions?: CourseExamQuestionType[];
    title: string;
    order: number
}

export interface CourseExamSectionPayload {
    course_exam_id?: number;
    section_name: string;
    duration: number;
    title: string;
  
}

