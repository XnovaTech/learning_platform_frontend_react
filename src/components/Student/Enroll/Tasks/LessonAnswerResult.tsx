import { Card } from '@/components/ui/card';
import type { LessonTaskType } from '@/types/task';
import { CheckCircle, XCircle, TrendingUp, AlertCircle, RotateCcw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog-context-menu';
import { useMutation } from '@tanstack/react-query';
import { deleteStudentRecords } from '@/services/studentLessonTaskService';
import { toast } from 'sonner';
import { useState } from 'react';
import type { StudentLessonType } from '@/types/answer';
import { getPerformanceMessage } from '@/mocks/tasks';
import { QuestionResultItem } from '@/components/QuestionResultItem';

interface LessonResultProps {
  studentAnswers?: StudentLessonType;
  tasks: LessonTaskType[];
  totalPossibleScore: number;
  enrollId: number;
  lessonId: number;
  refetch: () => void;
  isTeacher?: boolean;
  onScoreChange?: (taskId: number, score: number) => void;
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="leading-tight flex items-center gap-1 ">
        <div className="font-semibold   text-slate-800">{value}</div>
        <div className="text-sm l text-slate-500">{label}</div>
      </div>
    </div>
  );
}

export default function LessonAnswerResult({ studentAnswers, tasks, totalPossibleScore, enrollId, lessonId, refetch, isTeacher = false, onScoreChange }: LessonResultProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const totalScore = Object.values(studentAnswers || {}).reduce((sum, ans) => Number(sum) + Number(ans.score), 0);
  const percentage = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
  const totalQuestions = tasks.length;

  const correctAnswers = Object.values(studentAnswers || {}).filter((ans) => ans.is_correct && ans.score > 0).length;
  const performanceMessage = getPerformanceMessage(percentage);

  const deleteMutation = useMutation({
    mutationFn: ({ enrollId, lessonId }: { enrollId: number; lessonId: number }) => deleteStudentRecords(enrollId, lessonId),
    onSuccess: async () => {
      toast.success('Record Removed Successfully');
      setConfirmOpen(false);
      refetch();
    },
    onError: (e) => {
      toast.error(e?.message ?? 'Failed to delete record!');
    },
  });

  const askDelete = () => {
    setConfirmOpen(true);
  };

  const getParsedAnswer = (taskId: number) => {
    const record = studentAnswers?.[taskId];
    if (!record) return undefined;

    const raw = record.answer;

    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }

    return raw;
  };

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto space-y-5">
        {!isTeacher && (
          <div className="text-center ">
            <div className="inline-flex items-center gap-1 px-5 py-2 rounded-full bg-linear-to-r from-primary/5 to-primary/12 text-primary font-semibold shadow-sm">
              <Star className="size-4 text-yellow-500" />
              Lesson Completed !
              <Star className="size-4 text-yellow-500" />
            </div>
          </div>
        )}

        {/*  Summary Card */}
        <Card className={`px-5 py-6 border ${performanceMessage.borderColor} ${performanceMessage.bgColor}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className={`text-xl font-semibold ${performanceMessage.color}`}>{performanceMessage.text}</h2>
              <p className="text-sm text-slate-600">Lesson completed · {percentage}% score</p>
            </div>

            <div className="flex items-center gap-5 text-sm">
              <Stat icon={<CheckCircle className="w-5 h-5 text-green-600" />} value={correctAnswers} label="Correct" />
              <Stat icon={<XCircle className="w-5 h-5 text-red-600" />} value={totalQuestions - correctAnswers} label="Incorrect" />
              <Stat icon={<TrendingUp className="w-5 h-5 text-blue-600" />} value={`${totalScore}/${totalPossibleScore}`} label="Points" />
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3 justify-between ">
          <div className="flex items-center gap-2 pt-4">
            <AlertCircle className="w-5 h-5 text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-800">Detailed Review</h3>
          </div>

          {!isTeacher && (
            <Button variant="red" className="rounded-lg mt-2" onClick={askDelete}>
              <RotateCcw className="size-4" />
              Retake
            </Button>
          )}
        </div>

        {/* Questions  */}
        <div className="grid gap-4">
          {tasks.map((task, index) => {
            const ans = studentAnswers?.[task.id];
            const status = ans?.is_correct && ans.score > 0 ? 'correct' : ans?.is_correct === null && task.task_type === 'long' ? 'reviewing' : 'incorrect';

            return (
              <QuestionResultItem
                key={task.id}
                question={task}
                index={index}
                answer={ans}
                status={status}
                parsedAnswer={getParsedAnswer(task.id)}
                isTeacher={isTeacher}
                onScoreChange={onScoreChange}
                enrollId={enrollId}
              />
            );
          })}
        </div>
      </div>

      {/** Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Retake Lesson?"
        description="This action cannot be undone. Your previous answers will be permanently removed."
        confirmText="Retake"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        destructive
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={() => {
          deleteMutation.mutate({ enrollId, lessonId });
        }}
      />
    </div>
  );
}
