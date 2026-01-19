import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { ClassRoomType } from '@/types/class';
import { displayTime } from '@/utils/format';

interface UpcomingClassesCardProps {
  upcomingClasses: ClassRoomType[];
  isLoading: boolean;
}

export default function UpcomingClassesCard({ upcomingClasses, isLoading }: UpcomingClassesCardProps) {
  return (
    <Card className='bg-white rounded-2xl shadow-xl border-none'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600" />
          Upcoming Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="text-primary size-6" />
          </div>
        ) : upcomingClasses.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">You have {upcomingClasses.length} upcoming classes .</p>

            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-amber-50 to-red-50 border border-amber-100">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">{cls.class_name || cls.course.title}</p>
                  <p className="text-sm font-semibold text-amber-900">
                     {displayTime(cls.start_time)} - {displayTime(cls.end_time)}
                  </p>
                </div>

                <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="size-5 text-amber-600" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-10 w-10 text-amber-600 mx-auto mb-3" />
            <p className="text-amber-400">No upoming classes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
