import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { LessonTaskType } from '@/types/task';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import { useEffect, useState } from 'react';

interface TfTaskComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}

const dataList = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
];

export default function TfTaskComponent({ task, onAnswer, value, readonly, score, onScoreChange }: TfTaskComponentProps) {
  const [localScore, setLocalScore] = useState<string>(score ? score.toString() : '');

  useEffect(() => {
    setLocalScore(score ? score.toString() : '');
  }, [score]);

  return (
    <div className="space-y-3 my-auto w-full">
      <RadioGroup value={value?.toString()} onValueChange={(v) => !readonly && onAnswer(task.id, v)} className="grid gap-3">
        {dataList.map((data) => (
          <Label
            key={data.value}
            htmlFor={`${data.value}-${task.id}`}
            className={`flex items-center space-x-3 px-4 py-3 text-sm transition cursor-pointer border w-full
                                  rounded-xl duration-200 hover:bg-gray-100 ${value === data.value ? 'border-primary bg-primary/15 hover:bg-primary/20 ring-1 ring-primary/50' : ''}`}
          >
            <RadioGroupItem value={data.value} id={`${data.value}-${task.id}`} disabled={readonly} />
            <span className="text-gray-700">{data.label}</span>
          </Label>
        ))}
      </RadioGroup>

      {readonly && onScoreChange && (
        <div className="space-y-2 flex items-center gap-3">
          <Label className="text-base font-medium text-slate-700 mt-2">Score:</Label>
          <div className="flex items-center gap-2">
            <Input type="number" step={0.1} min={''} max={task.points || 100} value={localScore} onChange={(e) => setLocalScore(e.target.value)} className="w-30" />
            <Button className="rounded-lg" onClick={() => onScoreChange(task.id, localScore === '' ? 0 : parseFloat(localScore) || 0)}>
              Update Score
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
