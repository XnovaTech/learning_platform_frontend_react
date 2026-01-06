import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { ClassRoomType } from '@/types/class';
import { displayTime } from '@/utils/format';

interface TodaySummaryCardProps {
  todayClasses: ClassRoomType[];
  isLoading: boolean;
}

export default function TodaySummaryCard({ todayClasses, isLoading }: TodaySummaryCardProps) {
  return (
    <Card className='bg-white rounded-2xl shadow-xl border-none'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Today's Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="text-primary size-6" />
          </div>
        ) : todayClasses.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">You have {todayClasses.length} classes scheduled for today.</p>
            {todayClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-3  rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">{cls.class_name || cls.course.title}</p>
                  <p  className="text-sm font-semibold text-blue-900">
                    {displayTime(cls.start_time)} - {displayTime(cls.end_time)}
                  </p>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="size-5 text-blue-600" />
                </div>{' '}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-10 w-10 text-blue-600 mx-auto mb-3" />
            <p className="text-blue-400">No classes scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
