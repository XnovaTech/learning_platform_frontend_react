import type { ClassExamQuestionType } from "./courseexamquestion";

export interface SectionType {
  id: number;
  section_name: string;
  duration: number;
  title: string;
  order?: number;
}

export interface ClassExamSectionType extends SectionType {
  questions: ClassExamQuestionType[];
}

export interface CourseExamSectionType extends SectionType {
  course_exam_id: number;
  questions?: CourseExamQuestionType[];
}

export interface CourseExamSectionPayload {
  course_exam_id?: number;
  section_name: string;
  duration: number;
  title: string;
}
