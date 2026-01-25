import { Input } from '@/components/ui/input';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import type {  LessonTaskType } from '@/types/task';

interface FillBlankTaskComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
}

export default function FillBlankTaskComponent({ task, onAnswer, value, readonly }: FillBlankTaskComponentProps) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Fill in the blank ..."
        value={value}
        onChange={(e) => !readonly && onAnswer(task.id, e.target.value)}
        disabled={readonly}
        className={readonly ? 'bg-slate-100 text-slate-600' : ''}
      />
    </div>
  );
}
