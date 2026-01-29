import type { CourseExamSectionType } from './courseexamsection';

export interface CourseExamParagraphType {
  id: number;
  section_id: number;
  content: string;
  section?: CourseExamSectionType;
}

export interface CourseExamParagraphPayloadType {
  section_id: number;
  content: string;
}