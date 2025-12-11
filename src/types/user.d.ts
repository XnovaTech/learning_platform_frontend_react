import { EnrollType } from './enroll';

export interface UserType {
  id: number;
  cover: File | string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  roles?: string[];
}

export interface StudentType extends UserType {
  enrollments: EnrollType[];
}

export interface ClassMateType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export type statusType = 'new' | 'current' | 'old';

export interface Payload {
  id?: number;
  cover?: File | string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  password: string | number;
  role?: string;
  status?: statusType;
}

export interface PayloadUser extends Payload {}

export interface UpdatePayloadUser extends Payload {
  password?: string | number;
}

export type UpdateUserRequest = UpdatePayloadUser | FormData;
