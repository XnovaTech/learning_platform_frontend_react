
import { OverviewItem } from '@/types/dashboard';
import { BookOpen, Users, LayoutDashboard, BookAIcon } from 'lucide-react';

export const homeOverviews: OverviewItem[] = [
    { id: 0, title: 'Active Courses', value: 12, icon: BookOpen, color: 'bg-shell/90' },
    { id: 1, title: 'Completed Lesson', value: 10, icon: BookAIcon, color: 'bg-peacock/30' },
    { id: 2, title: 'Upcoming Lesson', value: 8, icon: LayoutDashboard, color: 'bg-red-sand/50' },
];
