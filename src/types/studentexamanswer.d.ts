import type { StudentAnswer } from './answer';

export interface StudentExamAnswers {
  id: number;
  enroll_id?: number;
  exam_id?: number;
  review?: string;
  status?: string;
  sections?: { name: string; title: string; total_score: number; total_possible_score: number }[];
}

export interface StudentExamSubmitPayload {
  enroll_id?: number;
  exam_id?: number;
  answers: { question_id: number; answer: any }[];
}

export interface StudentExamAnswerListRecordType {
  enroll_id: number;
  student_id: number;
  first_name: string;
  last_name: string;
  total_points: number;
  exam_total_points: number;
}

export interface StudentExamMarkUpdatePayload {
  enroll_id: number;
  question_id: number;
  score: number;
}

export interface StudentExamAnswersType extends StudentExamAnswers {
  answers: StudentAnswer[];
}
