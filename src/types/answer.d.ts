export type McqAnswer = string | number;
export type TrueFalseAnswer = 'true' | 'false';
export type FillBlankAnswer = string;
export type MatchingAnswer = Record<string, string>;
export type DragDropAnswer = Record<string, string>;
export type ShortAnswer = string;
export type LongAnswer = string;

export type StudentTaskAnswerValue = McqAnswer | TrueFalseAnswer | FillBlankAnswer | MatchingAnswer | DragDropAnswer | ShortAnswer | LongAnswer;

export interface StudentLessonSubmitPayload {
  lesson_id: number;
  enroll_id?: number;
  answers: Record<number, string | Record<string, string>>;
}

export interface StudentMarkUpdatePayload {
  enroll_id: number;
  task_id: number;
  score: number;
}

export interface StudentsLessonTaskRecordType {
  enroll_id: number;
  student_id: number;
  first_name: string;
  last_name: string;
  total_points: number;
  lesson_point: number;
}

export interface StudentExamAnswerDetail {
  answer: string | number;
  is_correct: number | null;
  score: number;
}

export type StudentExamAnswersType = Record<number, StudentExamAnswerDetail>;

//student course exams
export interface StudentExamSubmitPayload {
  enroll_id: number;
  answers: Record<number, string | Record<string, string>>;
}

export interface StudentExamMarkUpdatePayload {
  enroll_id: number;
  score: number;
}

export interface StudentCourseExamTaskRecordType {
  enroll_id: number;
  student_id: number;
  first_name: string;
  last_name: string;
  total_points: number;
  exam_total_points: number;
}
