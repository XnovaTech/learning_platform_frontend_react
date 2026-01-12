import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getClassExamDetails } from '@/services/classExamService';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Spinner } from '@/components/ui/spinner';
import { Home, BookOpen, Users, BookOpenCheck } from 'lucide-react';
import TaskRendererComponent from '@/components/Student/Enroll/Tasks/Render/TaskRendererComponent';
import { Button } from '@/components/ui/button';
import { TASK_TITLE } from '@/mocks/tasks';
import type { TaskType } from '@/types/task';
import type { ClassRoomExamType } from '@/types/classexam';
import { useState } from 'react';
import { toast } from 'sonner';
import { submitStudentCourseExams } from '@/services/studentCourseExamService';

export default function ExamDetailPage() {
  const [answers, setAnswers] = useState({});
  const { examId } = useParams<{ examId: string }>();
  const { enrollId } = useParams<{ enrollId: string }>();
  const { data: data, isLoading } = useQuery<ClassRoomExamType>({
    queryKey: ['exam-details', examId],
    queryFn: () => getClassExamDetails(Number(examId)),
    enabled: !!examId,
  });
  const courseExams = data?.class_room?.course?.exams || [];

  const groupExams = courseExams?.reduce((acc: Record<TaskType, typeof courseExams>, exam) => {
    if (!acc[exam.task_type]) acc[exam.task_type] = [];
    acc[exam.task_type].push(exam);
    return acc;
  }, {} as Record<TaskType, typeof courseExams>);

  const handleAnswer = (taskId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [taskId]: value }));
  };

  const submitMutation = useMutation({
    mutationFn: submitStudentCourseExams,
    onSuccess: async () => {
      toast.success('Exam Submitted Successfully');
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to submit exam!');
    },
  });

  const hasSubmittedAnswers = false;
  const totalPossibleScore = courseExams.reduce((sum, exam) => sum + (exam.points || 0), 0) || 0;

  return (
    <div className="max-w-9xl p-4 mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="hidden md:inline-flex" asChild>
              <Link className="text-base gap-2" to="/student/home">
                <Home className="size-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="hidden md:inline-flex" />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base gap-2" to="/student/enrolls">
                <BookOpen className="size-4" />
                My Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base gap-2" to={`/student/enrolls/${data?.class_room?.id}`}>
                <Users className="size-4" />
                {data?.class_room?.class_name || 'ClassRoom'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage className="text-base gap-2">
              <BookOpenCheck className="size-4" />
              {data?.exam_type}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur h-[60vh] p-6">
          <div className="flex items-center m-auto justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        </Card>
      ) : hasSubmittedAnswers ? (
        <div className="">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold mb-4">Exam Results</h1>
            <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">
              Total Score: <span className="text-green-600">0</span> / <span className="text-slate-800">{totalPossibleScore}</span>
            </div>
          </div>

          {courseExams?.map((exam) => (
            <Card key={exam.id} className="p-4 shadow-lg rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: exam.question || '' }} />
                <span className="font-medium text-gray-700">{exam.points} pts</span>
              </div>

              <TaskRendererComponent task={exam as any} />

              <div className="mt-2 text-right font-semibold text-green-600">Score: 0 / {exam.points}</div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="">
          <div className="bg-white/50 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-xl space-y-4">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold mb-2">{data?.exam_type} Exam</h1>
              <p className="text-sm text-slate-600">Until {data?.end_date}</p>
            </div>

            {groupExams && Object.keys(groupExams).length > 0 ? (
              <div className="">
                {Object.entries(groupExams).map(([type, examList]) => (
                  <div key={type} className="rounded-2xl border bg-white/70 p-5 mb-6">
                    <div className="mb-4 flex items-center justify-between border-b pb-3">
                      <h2 className="text-base font-semibold text-slate-800">{TASK_TITLE[type as TaskType]}</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{examList.length} questions</span>
                    </div>

                    <div className="space-y-4">
                      {examList.map((exam) => (
                        <Card key={exam.id} className="border rounded-xl shadow-sm">
                          <CardContent className="p-5 space-y-4">
                            <div className="flex items-start justify-between gap-4 border-b pb-3">
                              <div
                                className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800"
                                dangerouslySetInnerHTML={{
                                  __html: exam.question || '',
                                }}
                              />
                              <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{exam.points} pts</span>
                            </div>

                            <TaskRendererComponent task={exam as any} onAnswer={handleAnswer} />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="sticky bottom-0 mt-6 flex justify-end py-4">
                  <Button className="px-8" onClick={() => submitMutation.mutate({ enroll_id: Number(enrollId), answers })} disabled={submitMutation.isPending}>
                    {submitMutation.isPending ? <Spinner className="size-4 " /> : 'Submit Exam'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-primary/90 p-4 mb-4">
                  <BookOpenCheck className="size-8 text-white" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-1">No exam questions available for this moment.</h4>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
