import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CourseExamType, LessonTaskType } from '@/types/task';
import { useEffect, useState } from 'react';

interface ShortTaskComponentProps {
  task: LessonTaskType | CourseExamType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}

export default function ShortTaskComponent({ task, onAnswer, value = '', readonly = false, score, onScoreChange }: ShortTaskComponentProps) {
  const [text, setText] = useState('');

  const [localScore, setLocalScore] = useState<number>(score ?? 0);

  useEffect(() => {
    setLocalScore(score ?? 0);
  }, [score]);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className=" space-y-3">
      <Input
        type="text"
        value={text}
        placeholder="Type your answer here"
        onChange={(e) => {
          const val = e.target.value;
          setText(val);
          !readonly && onAnswer(task.id, val);
        }}
        disabled={readonly}
        className={readonly ? 'bg-slate-100 text-slate-600' : ''}
      />


      {readonly && onScoreChange && (
        <div className="pt-3 border-t space-y-2">
          <Label className="text-sm font-medium text-slate-700">Score</Label>
          <Input value={localScore} onChange={(e) => setLocalScore(Number(e.target.value))} className="w-28" />
          <Button className="px-4 py-2 bg-primary text-white rounded-lg mx-2 hover:bg-primary/90" onClick={() => onScoreChange(task.id, localScore)}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
