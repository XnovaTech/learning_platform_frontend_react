import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import type {  LessonTaskType } from '@/types/task';
import { useEffect, useState } from 'react';

interface FillBlankTaskComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}

export default function FillBlankTaskComponent({ task, onAnswer, value, readonly, score, onScoreChange }: FillBlankTaskComponentProps) {
  const [localScore, setLocalScore] = useState<number>(score ?? 0);

  useEffect(() => {
    setLocalScore(score ?? 0);
  }, [score]);

  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder="Fill in the blank ..."
        value={value}
        onChange={(e) => !readonly && onAnswer(task.id, e.target.value)}
        disabled={readonly}
        className={readonly ? 'bg-slate-100 text-slate-600' : ''}
      />

      {readonly && onScoreChange && (
        <div className="space-y-2 flex items-center gap-3">
          <Label className="text-base font-medium text-slate-700 mt-2">Score:</Label>
          <div className="flex items-center gap-2">
            <Input type="number" step={0.1} min={''} max={task.points || 100} value={localScore} onChange={(e) => setLocalScore(Number(e.target.value))} className="w-30" />
            <Button className='rounded-lg' onClick={() => onScoreChange(task.id, localScore)}>Update Score</Button>
          </div>
        </div>
      )}
    </div>
  );
}
