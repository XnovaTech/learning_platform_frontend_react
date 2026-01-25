import type { ClassExamSectionType } from "./courseexamsection";

export type ExamType = 'Midterm' | 'Final';

export interface ExamEntityType {
  intro: string;
  total_duration: number;
}

export interface ClassExamType extends ExamEntityType {
  id?: number;
  sections?: ClassExamSectionType[];
}

export interface CourseExamType extends ExamEntityType {
  id: number;
  course_id: number;
  exam_type: ExamType;
  sections?: CourseExamSectionType[];
}

export interface CourseExamPayload {
  course_id: number;
  exam_type: ExamType;
  intro?: string;
  total_duration: number;
}
