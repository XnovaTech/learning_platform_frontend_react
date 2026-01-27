import { getStudentLessonTasks } from '@/services/lessonTaskService';
import { getStudentLessonRecordDetail } from '@/services/studentLessonTaskService';
import { useQuery } from '@tanstack/react-query';
import type { LessonTaskType, TaskType } from '@/types/task';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import LessonAnswerList from './LessonAnswerList';
import LessonAnswerResult from './LessonAnswerResult';

interface LessonTaskComponentProps {
  lessonId?: number;
  enrollId?: number;
}

export default function LessonTaskComponent({ lessonId, enrollId }: LessonTaskComponentProps) {
  const [answers, setAnswers] = useState({});

  const { data: tasks } = useQuery<LessonTaskType[]>({
    queryKey: ['student-lesson-tasks', lessonId],
    queryFn: () => getStudentLessonTasks(lessonId!),
    enabled: !!lessonId,
  });

  const {
    data: studentAnswers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['studentRecord', enrollId, lessonId],
    queryFn: () => getStudentLessonRecordDetail(Number(enrollId), Number(lessonId)),
    enabled: !!lessonId && !!enrollId,
  });

  const handleAnswer = (taskId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [taskId]: value }));
  };

  const groupTasks = tasks?.reduce(
    (acc, task) => {
      if (!acc[task.task_type]) acc[task.task_type] = [];
      acc[task.task_type].push(task);
      return acc;
    },
    {} as Record<TaskType, LessonTaskType[]>,
  );

  const hasSubmittedAnswers = studentAnswers && typeof studentAnswers === 'object' && Object.keys(studentAnswers).length > 0;
  const totalPossibleScore = tasks?.reduce((sum, task) => Number(sum) + (Number(task.points) || 0), 0) || 0;
  const totalQuestions = tasks?.length || 0;

  return (
    <div className="bg-white/50 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-xl space-y-5">
      {isLoading ? (
        <div className="flex items-center m-auto justify-center py-14">
          <Spinner className="text-primary size-7 md:size-8" />
        </div>
      ) : hasSubmittedAnswers ? (
        <div className="px-4">
          <LessonAnswerResult studentAnswers={studentAnswers} tasks={tasks || []} totalPossibleScore={totalPossibleScore} enrollId={enrollId!} lessonId={lessonId!} refetch={refetch} />
        </div>
      ) : (
        <LessonAnswerList
          groupTasks={groupTasks || {}}
          answers={answers}
          handleAnswer={handleAnswer}
          enrollId={enrollId}
          lessonId={lessonId}
          totalQuestions={totalQuestions}
          totalPossibleScore={totalPossibleScore}
          refetch={refetch}
        />
      )}
    </div>
  );
}
