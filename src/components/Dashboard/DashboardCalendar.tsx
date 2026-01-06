import { BookOpen } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import ClassCalendar from '@/components/Calendar/ClassCalendar';
import type { ClassRoomType } from '@/types/class';
import { Card } from '../ui/card';

interface DashboardCalendarProps {
  classes: ClassRoomType[];
  isLoading: boolean;
  isTeacher: boolean;
}

export default function DashboardCalendar({ classes, isLoading, isTeacher = false }: DashboardCalendarProps) {
  return (
    <Card className="min-h-[60vh] overflow-hidden bg-white rounded-2xl shadow-xl p-5">
      {isLoading ? (
        <div className="flex items-center justify-center m-auto py-14">
          <Spinner className="text-primary size-7 md:size-8" />
        </div>
      ) : classes.length > 0 ? (
        <ClassCalendar classes={classes} isTeacher={isTeacher} />
      ) : (
        <div className="flex flex-col items-center justify-center m-auto">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <BookOpen className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-1">No active classes Found</h4>
          <p className="text-sm text-muted-foreground mb-4">our classes will appear here once they're scheduled</p>
        </div>
      )}
    </Card>
  );
}
