
import type { OverviewItem } from '@/types/dashboard';
import { BookOpen, Users, LayoutDashboard } from 'lucide-react';

export const overviews : OverviewItem[] = [
  { id: 0, title: 'Active Courses', value: 12, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
  { id: 1, title: 'Total Students',  value: 248, icon: Users, color: 'from-emerald-500 to-teal-600' },
  { id: 2, title: 'Upcoming Classes', value: 8, icon: LayoutDashboard, color: 'from-purple-500 to-pink-600' },
];
