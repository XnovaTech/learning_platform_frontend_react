import { ClassRoomType } from './class';
import type { ClassExamType } from './courseexam';


export interface ClassRoomExamType {
  id: number;
  class_id: number;
  exam_type: string | null;
  start_date: string | null;
  end_date: string | null;
  class_room?: ClassRoomType;
  exam?: ClassExamType;
  course_exam_id?: number;
}

export interface ClassRoomExamPayloadType {
  class_id: number;
  exam_type: string | null;
  start_date: string | null;
  end_date: string | null;
  course_exam_id?: number;
}
