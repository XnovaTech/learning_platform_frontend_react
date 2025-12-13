import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { listStudentsLessonTaskRecords } from '@/services/studentLessonTaskService';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

export default function LessonTaskRecords() {
  const params = useParams();
  const lessonId = Number(params.lessonId);
  const classRoomId = Number(params.classId);

  const { data: records, isLoading } = useQuery({
    queryKey: ['lessonTasks', lessonId],
    queryFn: () => listStudentsLessonTaskRecords(classRoomId, lessonId),
    enabled: !!lessonId && !!classRoomId,
  });

  if (isLoading) {
    return (
      <div className="max-w-8xl p-4 mx-auto space-y-6">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur p-6">
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className=" max-w-6xl mx-auto p-6 space-y-6">
      <h1 className=" text-3xl font-semibold tracking-tight">Lesson Task Records</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {records &&
          records.map((data) => (
            <Card key={data.enroll_id} className="shadow-md border border-slate-50 hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>{data.first_name} {data.last_name}</span> 
                  <p className=" text-sm px-3 py-2 rounded-2xl bg-primary text-white">
                    {data.total_points} / {data.lesson_point}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Student ID: {data.student_id}</p>

                <Link
  to={`/teacher/courses/classes/${data.enroll_id}/lesson/${lessonId}/records/detail`}
>
  <Button variant="secondary" className="w-full rounded-xl shadow-sm">
    View Details
  </Button>
</Link>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
