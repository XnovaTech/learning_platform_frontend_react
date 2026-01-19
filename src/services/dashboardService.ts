import api from './api';
import type { DashboardOverview } from '@/types/dashboard';


export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const { data } = await api.get('/v1/dashboard/teacher/overview');
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
