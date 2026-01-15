import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpenCheck, Award, CheckCircle2, BadgeCheck } from 'lucide-react';
import TaskRendererComponent from './Render/TaskRendererComponent';
import { TASK_TITLE } from '@/mocks/tasks';
import type { TaskType, LessonTaskType } from '@/types/task';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { submitStudentLessonTasks } from '@/services/studentLessonTaskService';
import type { StudentLessonSubmitPayload } from '@/types/answer';

interface LessonAnswerListProps {
  groupTasks: Record<TaskType, LessonTaskType[]> | Record<string, never>;
  answers: Record<number, any>;
  handleAnswer: (taskId: number, value: any) => void;
  enrollId: number | undefined;
  lessonId: number | undefined;
  totalQuestions: number;
  totalPossibleScore: number;
  refetch: () => void;
}

export default function LessonAnswerList({ groupTasks, answers, handleAnswer, enrollId, lessonId, totalQuestions, totalPossibleScore, refetch }: LessonAnswerListProps) {
  const submitMutation = useMutation({
    mutationFn: submitStudentLessonTasks,
    onSuccess: async () => {
      toast.success('Lesson Tasks Submitted Successfully');
      refetch();
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to submit lesson tasks!');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollId || !lessonId) return;

    await submitMutation.mutateAsync({
      enroll_id: enrollId,
      lesson_id: lessonId,
      answers: answers,
    } as StudentLessonSubmitPayload);
  };

  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="">
      {groupTasks && Object.keys(groupTasks).length > 0 ? (
        <div className="space-y-5">
          {/*  Overview */}
          <div className="rounded-2xl bg-white shadow-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-5 border-b bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpenCheck className="size-6 text-primary" />
                </div>

                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Lesson Tasks</h1>
                  <p className="text-sm text-slate-500">
                    {totalQuestions} Questions • {totalPossibleScore} Points
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Award className="size-4 text-primary" />
                  {totalPossibleScore} pts
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="px-6 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">Progress</span>
                <span className="font-semibold text-primary">{Math.round((totalAnswered / totalQuestions) * 100)}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${(totalAnswered / totalQuestions) * 100}%`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-500">
                {totalAnswered} / {totalQuestions} answered
              </p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {Object.entries(groupTasks).map(([type, taskList]) =>
              taskList.map((task, index) => {
                const isAnswered = answers.hasOwnProperty(task.id);
                const globalIndex =
                  Object.values(groupTasks)
                    .slice(0, Object.keys(groupTasks).indexOf(type))
                    .reduce((sum, tasks) => sum + tasks.length, 0) +
                  index +
                  1;

                return (
                  <Card key={task.id} className="border p-1 border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-0 mb-1">
                      <div className="flex items-center justify-between px-4 py-3 border-b rounded-md bg-stone-50">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">{TASK_TITLE[task.task_type as TaskType]}</span>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold">{task.points} pts</span>

                          {isAnswered && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                              <CheckCircle2 className="size-3" />
                              Answered
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="bg-white px-5 py-4">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 flex items-center justify-center font-bold text-sm mt-0.5">{globalIndex} .</div>

                          <div className="flex-1 min-w-0">
                            {task.task_type !== 'paragraph_drag' ? (
                              <div
                                className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800"
                                dangerouslySetInnerHTML={{
                                  __html: task.question || '',
                                }}
                              />
                            ) : (
                              <p>Choose the correct answers</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Answer Area */}
                      <div className="p-5 bg-white">
                        <TaskRendererComponent task={task} onAnswer={handleAnswer} value={answers[task.id]} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end  ">
            <Button className="rounded-lg py-5" onClick={handleSubmit} disabled={submitMutation.isPending}>
              {submitMutation.isPending ? (
                'Submitting'
              ) : (
                <p className="flex items-center gap-2">
                  <BadgeCheck className="size-4" />
                  Submit
                </p>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <BookOpenCheck className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-1">No lesson tasks available for this moment.</h4>
        </div>
      )}
    </div>
  );
}
