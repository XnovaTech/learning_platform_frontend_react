import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CourseExamType, LessonTaskType, LongAnswerExtraData } from '@/types/task';
import { useEffect, useState } from 'react';

interface LongTaskComponentProps {
  task: LessonTaskType | CourseExamType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}

export default function LongTaskComponent({ task, onAnswer, value = '', readonly = false, score, onScoreChange }: LongTaskComponentProps) {
  const minWords = (task?.extra_data as LongAnswerExtraData)?.min_word_count || 50;
  const [text, setText] = useState('');
  const [localScore, setLocalScore] = useState<number>(score ?? 0);

  useEffect(() => {
    setLocalScore(score ?? 0);
  }, [score]);

  useEffect(() => {
    setText(value);
  }, [value]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isValid = wordCount >= minWords;

  return (
    <div className="space-y-3">
      <div className="space-y-2">

        <Textarea
          className={`min-h-40 resize-y ${readonly ? 'bg-slate-100 text-slate-600' : ''}`}
          placeholder={`Write at lease ${minWords} words ...`}
          value={text}
          onChange={(e) => {
            const val = e.target.value;
            setText(val);
            !readonly && onAnswer(task.id, val);
          }}
        />

        <div className=" flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Minimum words required: {minWords}</span>

          <span className={`font-semibold ${isValid ? 'text-emerald-600' : 'text-red-500'}`}>
            {wordCount} / {minWords} words
          </span>
        </div>
      </div>

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
