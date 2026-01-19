import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getStudentLessonTasks } from '@/services/lessonTaskService';
import { getStudentLessonRecordDetail, updateStudentMark } from '@/services/studentLessonTaskService';
import type { StudentMarkUpdatePayload } from '@/types/answer';
import type { LessonTaskType } from '@/types/task';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import LessonAnswerResult from '@/components/Student/Enroll/Tasks/LessonAnswerResult';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { BookOpen, Book, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { enrollDetail } from '@/services/enrollService';
import { lessonDetail } from '@/services/lessonService';

export default function StudentTaskDetail() {
  const { lessonId, enrollId } = useParams();
  const lessonID = Number(lessonId);
  const enrollID = Number(enrollId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: answers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['studentRecord', enrollID],
    queryFn: () => getStudentLessonRecordDetail(enrollID, lessonID),
    enabled: !!lessonID && !!enrollID,
  });

  const { data: tasks } = useQuery<LessonTaskType[]>({
    queryKey: ['lesson-task', lessonID],
    queryFn: () => getStudentLessonTasks(lessonID),
    enabled: !!lessonID,
  });

  const { data: enrollment } = useQuery({
    queryKey: ['enrollment', enrollID],
    queryFn: () => enrollDetail(enrollID),
    enabled: !!enrollID,
  });

  const { data: lesson } = useQuery({
    queryKey: ['lesson', lessonID],
    queryFn: () => lessonDetail(lessonID),
    enabled: !!lessonID,
  });

  const classroom = enrollment?.class_room;

  const updateMarkMutation = useMutation({
    mutationFn: updateStudentMark,
    onSuccess: () => {
      toast.success('Point updated successfully ');
      setIsSubmitting(false);
      refetch();
    },
    onError: () => {
      toast.error('Failed to update score');
      setIsSubmitting(false);
    },
  });

  const handleScoreChange = async (taskId: number, score: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    await updateMarkMutation.mutateAsync({
      enroll_id: enrollID,
      task_id: taskId,
      score,
    } as StudentMarkUpdatePayload);
  };

  const totalPossibleScore = tasks?.reduce((sum, task) => sum + (task.points || 0), 0) || 0;

  return (
    <div className="max-w-9xl mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/${classroom?.course?.id}`}>
                <Book className="size-4" />
                {classroom?.course?.title || 'Course'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/classes/${classroom?.id}`}>
                <Users className="size-4" />
                {classroom?.class_name || 'Class'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/classes/${classroom?.id}/lessons/${lessonID}/records`}>
                <BookOpen className="size-4" />
                {lesson?.title || 'Lesson'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md gap-2">Student Task Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <Card className="py-10 items-center h-64 flex justify-center m-auto">
          <Spinner className="size-8  text-primary" />
        </Card>
      ) : answers.length === 0 ? (
        <div className="flex flex-col items-center justify-center  h-[50vh] bg-white rounded-xl backdrop-blur">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <BookOpen className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold"> Student answer has not been submitted yet. </h4>
        </div>
      ) : (
        <LessonAnswerResult
          studentAnswers={answers}
          tasks={tasks || []}
          totalPossibleScore={totalPossibleScore}
          enrollId={enrollID}
          lessonId={lessonID}
          refetch={refetch}
          isTeacher={true}
          onScoreChange={handleScoreChange}
        />
      )}
    </div>
  );
}
