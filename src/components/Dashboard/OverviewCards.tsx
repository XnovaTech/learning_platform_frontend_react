import { BookOpen, Users, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { DashboardOverview } from '@/types/dashboard';

interface OverviewCardsProps {
  overview: DashboardOverview | undefined;
  isLoading: boolean;
}

export default function OverviewCards({ overview, isLoading }: OverviewCardsProps) {
  const overviews = [
    { id: 0, title: 'Total Courses', value: overview?.total_courses || 0, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { id: 1, title: 'Total Active Students', value: overview?.total_students || 0, icon: Users, color: 'from-emerald-500 to-teal-600' },
    { id: 2, title: 'Total Active Classes', value: overview?.total_active_classes || 0, icon: LayoutDashboard, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
      {isLoading ? (
        <div className="col-span-full flex items-center justify-center py-14">
          <Spinner className="text-primary size-7 md:size-8" />
        </div>
      ) : (
        overviews.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.id} className={`cursor-pointer shadow-md hover:shadow-lg transition-all hover:-translate-y-1 text-white bg-gradient-to-br ${item.color} border-0`}>
              <CardHeader className="flex flex-row items-center justify-between ">
                <Icon className="h-8 w-8 opacity-90" />
                <p className="font-bold text-3xl">{item.value}</p>
              </CardHeader>

              <CardContent>
                <CardTitle className="text-base font-semibold opacity-90">{item.title}</CardTitle>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
