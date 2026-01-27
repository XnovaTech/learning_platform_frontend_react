import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { LessonTaskType } from '@/types/task';
import { cn } from '@/lib/utils';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import { useEffect, useState } from 'react';

interface McqTaskComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}



export default function McqTaskComponent({ task, onAnswer, value, readonly = false, score, onScoreChange }: McqTaskComponentProps) {
  const [localScore, setLocalScore] = useState<string>(score ? score.toString() : '');

  useEffect(() => {
    setLocalScore(score ? score.toString() : '');
  }, [score]);

  return (
    <div className="my-auto space-y-3 w-full">
      <RadioGroup value={value?.toString()} onValueChange={(v) => !readonly && onAnswer(task.id, v)} className="grid gap-3">
        {task?.options?.map(
          (opt, index) => {
            const selected = value?.toString() === opt.id.toString();
            return (
              <Label
                key={opt.id}
                htmlFor={`mcq-${opt.id}`}
                className={cn(
                  'flex items-center gap-4 rounded-xl border px-4 py-3 text-sm transition cursor-pointer',
                  'hover:bg-slate-50',
                  selected && 'border-primary bg-primary/15 hover:bg-primary/20 ring-1 ring-primary/50',
                  readonly && 'cursor-not-allowed opacity-70'
                )}
              >
                   {/* Radio */}
                <RadioGroupItem value={opt.id.toString()} id={`mcq-${opt.id}`} disabled={readonly} />

                <div
                  className={cn('flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold', selected ? 'bg-primary text-white border-primary' : 'bg-slate-100 text-slate-600')}
                >
                  {String.fromCharCode(65 + index)}
                </div>

                {/* Option Text */}
                <span className="flex-1 text-slate-800">{opt.option_text}</span>


              </Label>
            );
          }
        )}
      </RadioGroup>

      {readonly && onScoreChange && (
        <div className=" space-y-2 flex items-center gap-3">
          <Label className="text-base font-medium text-slate-700 mt-2">Score:</Label>
          <div className="flex items-center gap-2">
            <Input type="number" step={0.1} min={''} max={task.points || 100} value={localScore} onChange={(e) => setLocalScore(e.target.value)} className="w-30" />
            <Button className='rounded-lg' onClick={() => onScoreChange(task.id, localScore === '' ? 0 : parseFloat(localScore) || 0)}>Update Score</Button>
          </div>
        </div>
      )}
    </div>
  );
}
