import { ClassMateType, UserType } from './user';
import { ClassRoomType } from './class';

export interface EnrollType {
  id: number;
  student_id: number;
  student: UserType;
  class_id: number;
  class_room: ClassRoomType;
  class_mates: ClassMateType[];
  status: number;
}

export type EnrollPayloadType =
  | {
      student_id: number | undefined;
      class_id: number | null;
    }
  | FormData;

