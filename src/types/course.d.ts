
import { UserType } from './user';
import { ClassRoomType } from './class';
import { CategoryType } from './category';
import { LessonType } from './lesson';
import type { CourseExamType } from './task';

export interface CourseType {
  id: number;
  category_id: number | string;
  title: string;
  description?: string;
  status: number | string;
  image?: File | string | null;
  banner?: File | string | null;
  price?: number | string;
  //classRooms: ClassRoomType[];
  class_rooms: ClassRoomType[];
  category: CategoryType;
  lessons: LessonType[];
  exams: CourseExamType[];
}

export interface CourseListResponse {
  courses: CourseType[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Payload {
   category_id: number | string;
    title: string;
    description?: string;
    status: number | string;
    image?: File | string | null;
    banner?: File | string | null;
    price?: number | string;
}

export interface CoursePayloadType extends Payload {}

export type CourseFormType  = CoursePayloadType | FormData;


