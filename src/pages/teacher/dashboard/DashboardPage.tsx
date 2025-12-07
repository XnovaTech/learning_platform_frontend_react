import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { overviews } from '@/mocks/dashboard';
import { getActiveClassesByTeacher } from '@/services/classService';
import type { ClassRoomType } from '@/types/class';
import ClassCalendar from '@/components/Calendar/ClassCalendar';

export default function DashboardPage() {
  const { data: classes = [], isLoading } = useQuery<ClassRoomType[]>({
    queryKey: ['teacher-active-classes'],
    queryFn: getActiveClassesByTeacher,
  });

  return (
    <div className="mx-auto max-w-8xl p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap">
        <h1 className="text-3xl font-medium text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your teaching overview.</p>
      </div>

      {/* overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviews.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item?.id} className={`cursor-pointer shadow-md hover:shadow-lg transition-all hover:-translate-y-1 text-white bg-gradient-to-br ${item.color} border-0`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Icon className="h-8 w-8 opacity-90" />
                <p className="font-bold text-3xl">{item.value}</p>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base font-semibold opacity-90">{item.title}</CardTitle>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* calendar */}
      <div className="min-h-[60vh] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        ) : classes.length > 0 ? (
          <ClassCalendar classes={classes} isTeacher={true} />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary/90 p-4 mb-4">
              <BookOpen className="size-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-1">No active classes Found</h4>
            <p className="text-sm text-muted-foreground mb-4">our classes will appear here once they're scheduled</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-md border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
          <CardDescription>Latest updates across your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">New course material uploaded</p>
                <p className="text-xs text-gray-500 mt-1">Mathematics 101 • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">15 students joined your class</p>
                <p className="text-xs text-gray-500 mt-1">Physics 201 • 5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
