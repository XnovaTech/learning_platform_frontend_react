import type { EnrollType } from './enroll';

export interface UserCertificate {
  id: number;
  enroll_id: number;
  total_mark: number;
  teacher_remark: string | null;
  enrollment: EnrollType;
}
