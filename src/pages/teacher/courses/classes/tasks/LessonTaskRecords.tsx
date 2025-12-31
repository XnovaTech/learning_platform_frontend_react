import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { listStudentsLessonTaskRecords } from '@/services/studentLessonTaskService';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

export default function LessonTaskRecords() {
  const { lessonId, classId } = useParams();

  const lessonID = Number(lessonId);
  const classRoomID = Number(classId);

  const { data: records, isLoading } = useQuery({
    queryKey: ['lesson-task-records', classRoomID, lessonID],
    queryFn: () =>
      listStudentsLessonTaskRecords(classRoomID, lessonID),
    enabled: !!lessonID && !!classRoomID,
  });

  /* ---------------- Loading ---------------- */
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <div className="flex items-center justify-center py-20">
            <Spinner className="size-8 text-primary" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Lesson Task Records
        </h1>
        <p className="text-sm text-slate-500">
          Review student performance for this lesson
        </p>
      </header>

      {/* Records */}
      {records && records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((record) => (
            <Card
              key={record.enroll_id}
              className="group border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold leading-tight">
                      {record.first_name} {record.last_name}
                    </p>
                  
                  </div>

                  <div className="shrink-0 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    {record.total_points} / {record.lesson_point}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <Link
                  to={`/teacher/courses/classes/${record.enroll_id}/lesson/${lessonID}/records/detail`}
                >
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl transition group-hover:bg-primary group-hover:text-slate-800"
                  >
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="border-dashed border-2 rounded-2xl p-10 text-center text-slate-500">
          <p className="font-medium">No records found</p>
          <p className="text-sm mt-1">
            Students have not submitted tasks yet
          </p>
        </Card>
      )}
    </div>
  );
}
