import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import type { LessonTaskType } from '@/types/task';
import { useEffect, useState } from 'react';

interface ShortTaskComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}

export default function ShortTaskComponent({ task, onAnswer, value = '', readonly = false, score, onScoreChange }: ShortTaskComponentProps) {
  const [text, setText] = useState('');
  const [localScore, setLocalScore] = useState<string>(score ? score.toString() : '');

  useEffect(() => {
    setLocalScore(score ? score.toString() : '');
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
        <div className="space-y-2 flex  items-center gap-3">
          <Label className="text-base font-medium text-slate-700 mt-2">Score:</Label>
          <div className="flex items-center gap-2">
            <Input  type="number"  step={0.1} min={''}  max={task.points || 100} value={localScore} onChange={(e) => setLocalScore(e.target.value)} className="w-30" />
            <Button className='rounded-lg' onClick={() => onScoreChange(task.id, localScore === '' ? 0 : parseFloat(localScore) || 0)}>Update Score</Button>
          </div>
        </div>
      )}
    </div>
  );
}
