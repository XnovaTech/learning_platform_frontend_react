import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LessonTaskType } from '@/types/task';
import { useEffect, useState } from 'react';

interface ShortTaskComponentProps {
  task: LessonTaskType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}

export default function ShortTaskComponent({ task, onAnswer, value = '', readonly = false, score, onScoreChange }: ShortTaskComponentProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className=" space-y-4">
      <div className=" space-y-1">
        <Label className=" text-sm font-medium text-slate-700">Student Answer:</Label>

        <Input
          type="text"
          value={text}
          placeholder="Type your answer here"
          onChange={(e) => {
            const val = e.target.value
            setText(val)
            !readonly && onAnswer(task.id, val)}}
          disabled={readonly}
          className={readonly ? 'bg-slate-100 text-slate-600' : ''}
        />
      </div>
      {readonly && onScoreChange && (
        <div className=" flex items-center gap-4 rounded-lg border bg-slate-50 p-3">
          <Label className='text-sm font-medium text-slate-700'>Score</Label>
          <Input type="number" value={score ?? 0} onChange={(e) => onScoreChange(task.id, Number(e.target.value))} className="w-24 text-center" />

          <span className=' text-xs text-slate-500'>
            / {task.points} pts
          </span>
        </div>
      )}
    </div>
  );
}
