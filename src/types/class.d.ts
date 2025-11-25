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
  lessons?: LessonType[];
  class_name: string | null;
  start: string;
  end: string;
  start_time: time | null;
  end_time: time | null;
  is_active: boolean;
  zoom_link: string;
}

export interface ClassRoomPayloadType {
  course_id?: number | string;
  teacher_id?: number | string | null;
  class_name: string | null;
  start: string | null;
  end: string | null;
  start_time: time | null;
  end_time: time | null;
  is_active: boolean | number | string;
  zoom_link: string;
}
