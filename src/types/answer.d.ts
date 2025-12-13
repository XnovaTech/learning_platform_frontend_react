export type McqAnswer = string | number;
export type TrueFalseAnswer = "true" | "false";
export type FillBlankAnswer = string;
export type MatchingAnswer = Record<string, string>;
export type DragDropAnswer = Record<string, string>;
export type ShortAnswer = string;
export type LongAnswer = string;

export type StudentTaskAnswerValue = 
    | McqAnswer
    | TrueFalseAnswer
    | FillBlankAnswer
    | MatchingAnswer
    | DragDropAnswer
    | ShortAnswer
    | LongAnswer;

export interface StudentLessonSubmitPayload {
    lesson_id: number;
    enroll_id?: number;
    answers: Record<number, string | Record<string, string>>;
}

export interface StudentsLessonTaskRecordType {
    enroll_id: number,
    student_id: number,
    first_name: string,
    last_name: string,
    total_points: number,
    lesson_point: number
}