import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '@/services/dashboardService';
import { getActiveClassesByTeacher } from '@/services/classService';
import type { ClassRoomType } from '@/types/class';
import type { DashboardOverview } from '@/types/dashboard';
import OverviewCards from '@/components/Dashboard/OverviewCards';
import TodaySummaryCard from '@/components/Dashboard/TodaySummaryCard';
import UpcomingClassesCard from '@/components/Dashboard/UpcomingClassesCard';
import QuickActionsCard from '@/components/Dashboard/QuickActionsCard';
import DashboardCalendar from '@/components/Dashboard/DashboardCalendar';
import { getTodayClasses, getUpcomingClasses } from '@/helper/classroom';

type DashboardHeaderProps = {
  title: string;
  description: string;
};

const DashboardHeader = ({ title, description }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-medium text-gray-900">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { data: classes = [], isLoading } = useQuery<ClassRoomType[]>({
    queryKey: ['teacher-active-classes'],
    queryFn: getActiveClassesByTeacher,
  });

  const { data: overview, isLoading: overviewLoading } = useQuery<DashboardOverview>({
    queryKey: ['dashboard-overview'],
    queryFn: getDashboardOverview,
  });

  const todayClasses = getTodayClasses(classes);
  const upcomingClasses = getUpcomingClasses(classes);

  return (
    <div className="mx-auto max-w-8xl p-6 space-y-8">
      <DashboardHeader title="Dashboard" description="Welcome back! Here's your teaching overview." />

      <OverviewCards overview={overview} isLoading={overviewLoading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodaySummaryCard todayClasses={todayClasses} isLoading={isLoading} />
        <UpcomingClassesCard upcomingClasses={upcomingClasses} isLoading={isLoading} />
      </div>

      <QuickActionsCard />

      <DashboardCalendar classes={classes} isLoading={isLoading} isTeacher={true} />
    </div>
  );
}
