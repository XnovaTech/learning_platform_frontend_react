import type { CourseExamSectionType } from './courseexamsection';
import type { TaskType, ExtraData } from './task';

export interface CourseExamQuestionType {
  id: number;
  section_id: number;
  question: string;
  task_type: TaskType;
  correct_answer?: string;
  extra_data?: ExtraData;
  points: number;
  order: number;
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
