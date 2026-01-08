import { ClassRoomType } from './class';

export interface ClassRoomExamType {
  id: number;
  class_id: number;
  exam_type: string | null;
  start_date: string | null;
  end_date: string | null;
  classroom?: ClassRoomType;
}

export interface ClassRoomExamPayloadType {
  class_id: number;
  exam_type: string | null;
  start_date: string | null;
  end_date: string | null;
}
