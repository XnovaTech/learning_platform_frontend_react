import type { ClassRoomExamType } from './classexam';
import { CourseType } from './course';
import { LessonType } from './lesson';
import { ClassMateType, UserType } from './user';

export interface ClassRoomType {
  id: number;
  course_id?: number | string;
  teacher_id?: number | string | null;
  teacher: UserType;
  course: CourseType;
  class_mates?: ClassMateType[];
  exams?: ClassRoomExamType[];
  lessons?: LessonType[];
  class_name: string | null;
  start: string;
  end: string;
  start_time: time | null;
  end_time: time | null;
  is_active: boolean | number;
  is_finish: boolean | number;
  zoom_link: string;
  days: string[];
}

export interface ClassRoomPayloadType {
  course_id?: number | string;
  teacher_id?: number | string | null;
  class_name: string | null;
  start: string | null | date;
  end: string | null | date;
  start_time: time | null;
  end_time: time | null;
  is_active: boolean | number;
  is_finish: boolean | number;
  zoom_link: string;
  days: string[];
}
