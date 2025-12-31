import { getStudentLessonTasks, } from '@/services/lessonTaskService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LessonTaskType, TaskType } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import TaskRendererComponent from './Render/TaskRendererComponent';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { StudentLessonSubmitPayload } from '@/types/answer';
import { deleteStudentRecords, getStudentLessonRecordDetail, submitStudentLessonTasks } from '@/services/studentLessonTaskService';
import { ConfirmDialog } from '@/components/ui/dialog-context-menu';

interface LessonTaskComponentProps {
  lessonId?: number;
  enrollId?: number;
}

const TASK_TITLE: Record<TaskType, string> = {
  mcq: 'Multiple Choice Question',
  short: 'Short Answer',
  long: 'Long Answer',
  drag_drop: 'Drag and Drop',
  matching: 'Matching',
  fill_blank: 'Fill in the Blanks',
  true_false: 'True or False',
  paragraph_drag: 'Paragraph Reading'

};

export default function LessonTaskComponent({ lessonId, enrollId }: LessonTaskComponentProps) {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks } = useQuery<LessonTaskType[]>({
    queryKey: ['student-lesson-tasks', lessonId],
    queryFn: () => getStudentLessonTasks(lessonId!),
    enabled: !!lessonId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const {
    data: studentAnswers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['studentRecord', enrollId],
    queryFn: () => getStudentLessonRecordDetail(Number(enrollId), Number(lessonId)),
    enabled: !!lessonId && !!enrollId,
  });

  const createMutation = useMutation({
    mutationFn: submitStudentLessonTasks,
    onSuccess: async () => {
      toast.success('Answer Submitted');
      setIsSubmitting(false);
      refetch();
    },
    onError: (e: any) => {
      console.error(e?.message || 'Failed to submit lesson tasks!');
      setIsSubmitting(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({enrollId, lessonId}: {enrollId: number; lessonId: number}) => 
        deleteStudentRecords(enrollId, lessonId),
    onSuccess: async () => {
      toast.success('Record Removed Successfully');
      await queryClient.invalidateQueries({ queryKey: ['studentRecord'] });
      setConfirmOpen(false);
      refetch()
    },
    onError: (e) => {
      toast.error(e?.message || 'Failed to delete category !');
    },
  });


  const handleAnswer = (taskId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!enrollId || !lessonId) return;

    setIsSubmitting(true);

    await createMutation.mutateAsync({
      enroll_id: enrollId,
      lesson_id: Number(lessonId),
      answers: answers,
    } as StudentLessonSubmitPayload);
  };

  const getParsedAnswer = (taskId: number) => {
    const record = studentAnswers?.[taskId];
    if (!record) return undefined;

    const raw = record.answer;

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  };

  const askDelete = () => {
    setConfirmOpen(true);
  };


  const groupTasks = tasks?.reduce((acc, task) => {
    if (!acc[task.task_type]) acc[task.task_type] = [];
    acc[task.task_type].push(task);
    return acc;
  }, {} as Record<TaskType, LessonTaskType[]>);

  const hasSubmittedAnswers = studentAnswers && typeof studentAnswers === 'object' && Object.keys(studentAnswers).length > 0;

    const totalPossibleScore = tasks?.reduce((sum, task) => sum + (task.points || 0), 0) || 0;

  const totalStudentScore =
    tasks?.reduce((sum, task) => {
      const score = studentAnswers?.[task.id]?.score;
      return sum + (typeof score === 'number' ? score : 0);
    }, 0) || 0;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 flex items-center justify-center h-[60vh]">
        <Spinner className="text-primary size-8" />
      </Card>
    );
  }

  if (hasSubmittedAnswers) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4">
        <div className=' flex justify-between'>
           <h1 className="text-2xl font-semibold mb-4">Student Answers & Marks</h1>


          <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">
            Total Score: <span className="text-green-600">{totalStudentScore}</span>
            {' / '}
            <span className="text-slate-800">{totalPossibleScore}</span>
            <Button variant="ghost" className="text-red-600 bg-primary/20 hover:bg-red-50 mx-3" onClick={askDelete}>
              Retake
            </Button>
          </div>
        </div>
       
     



        {tasks?.map((task) => (
          <Card key={task.id} className="p-4 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-4">
             {
              task.task_type !== 'paragraph_drag' ? 
                <div
                className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800"
                dangerouslySetInnerHTML={{
                  __html: task.question || '',
                }}
              /> : <p>Choose the correct answers</p>
             }
              
              <span className="font-medium text-gray-700">{task.points} pts</span>
            </div>

            <TaskRendererComponent
              task={task}
              value={getParsedAnswer(task.id)}
              readonly={true} // make readonly for teacher view
              score={studentAnswers?.[task.id]?.score}
            />

            {/* Optional: display student's score if available */}
            {studentAnswers?.[task.id]?.score !== undefined && (
              <div className="mt-2 text-right font-semibold text-green-600">
                Score: {studentAnswers[task.id].score} / {task.points}
              </div>
            )}
          </Card>
        ))}

         {/** Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Retake Tasks?"
        description="This action cannot be undone. The category will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        destructive
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={() => {
          deleteMutation.mutate({enrollId: enrollId!, lessonId: lessonId!});
        }}
      />

      </div>
    );
  } else {
    return (
      <div className=" drop-shadow-2xl backdrop-blur-lg bg-white/50 dark:bg-slate-900/80 rounded-2xl p-6 md:p-8">
        <h1 className=" text-2xl font-semibold mb-2"> Lesson Tasks</h1>
        {groupTasks && Object.keys(groupTasks).length > 0 ? (
          Object.entries(groupTasks).map(([type, taskList]) => (
            <div key={type} className="rounded-2xl border bg-white/70 p-5 mb-6">
              <div className="mb-4 flex items-center justify-between border-b pb-3">
                <h2 className="text-base font-semibold text-slate-800">{TASK_TITLE[type as TaskType]}</h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{taskList.length} questions</span>
              </div>

              <div className="space-y-4">
                {taskList.map((task) => (
                  <Card key={task.id} className=" border rounded-xl shadow-sm">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-4 border-b pb-3">
                        {
                          task.task_type !== 'paragraph_drag' ? <div
                          className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800"
                          dangerouslySetInnerHTML={{
                            __html: task.question || '',
                          }}
                        /> : <p>Choose the correct answers</p>
                        }
                        
                        <span className=" shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{task.points} pts</span>
                      </div>

                      <div className="pt-2">
                        <TaskRendererComponent task={task} onAnswer={handleAnswer} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 mt-4 font-semibold">No tasks available for this lesson.</p>
        )}

        <div className=" sticky bottom-0 mt-6 flex justify-end bg-transparent py-4">
          <Button onClick={handleSubmit} disabled={isSubmitting} className="px-8">
            {isSubmitting ? 'Submitting ...' : 'Submit'}
          </Button>
        </div>
      </div>
    );
  }
}
