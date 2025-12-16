import { CourseType } from './course';
import type { LessonDocumentType } from './lessondocument';
import type { LessonTaskType } from './task';

export interface LessonType {
  id: number;
  course_id: number;
  course: CourseType;
  description: string;
  title: string;
  youtube_link: string;
  is_locked: number;
  classroom_lesson_locks?: Array;
  tasks: LessonTaskType[];
  documents?: LessonDocumentType[] | null;
}

export interface Payload {
  course_id?: number | string;
  description: string | null;
  title: string | null;
  youtube_link: string | null;
  documents: File[];
}

export interface LessonPayloadType extends Payload {}
export type LessonFormType = LessonPayloadType | FormData;

export interface LessonLockType {
  lessonId: number;
  classroomId: number;
  is_locked: boolean;
}
