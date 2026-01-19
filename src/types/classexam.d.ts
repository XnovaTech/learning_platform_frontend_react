import { ClassRoomType } from './class';
import { CourseExamType } from './task';

export interface ClassRoomExamType {
  id: number;
  class_id: number;
  exam_type: string | null;
  start_date: string | null;
  end_date: string | null;
  class_room?: ClassRoomType;
  exams?:CourseExamType[];
}

export interface ClassRoomExamPayloadType {
  class_id: number;
  exam_type: string | null;
  start_date: string | null;
  end_date: string | null;
}
