import type { CourseExamParagraphType } from './courseexamparagraph';
import type { CourseExamSectionType } from './courseexamsection';
import type { TaskType, ExtraData, blankType } from './task';

export interface QuestionType {
  id: number;
  paragraph_id?: number,
  paragraph?: CourseExamParagraphType,
  task_type: TaskType;
  question: string | null;
  correct_answer?: string | null;
  extra_data?: ExtraData | null;
  points: number;
  order?: number | null;
  options?: CourseExamOptionEntity[];
}

export interface ClassExamQuestionType extends QuestionType {
  targets?: { id: string; text: string }[];
  items?: { id: string; text: string }[];
  left?: { id: string; text: string }[];
  right?: { id: string; text: string }[];

  blanks?: blankType[];
}

export interface CourseExamQuestionType extends QuestionType {
  id: number;
  section_id?: number;
  options?: CourseExamOptionEntity[];
  section?: CourseExamSectionType;
}

export interface CourseExamOptionEntity {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  pair_key?: string | null;
  order: number;
}

export interface CourseExamQuestionPayloadType {
  section_id?: number;
  paragraph_id?: number;
  question: string;
  correct_answer?: string | null;
  extra_data?: ExtraData | null;
  task_type: TaskType;
  points?: number | null;
  order?: number | null;
  extra_data?: ExtraData;
  options?: {
    option_text: string;
    is_correct: boolean;
    pair_key?: string | null;
    order: number | null;
  }[];
}
