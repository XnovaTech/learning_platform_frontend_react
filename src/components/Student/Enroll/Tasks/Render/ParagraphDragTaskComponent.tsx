import { useMemo, useState, useEffect } from 'react';
// import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {  LessonTaskType } from '@/types/task';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';

interface Props {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: Record<string, string>) => void;
  readonly?: boolean;
  value?: Record<string, string>;
  score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}

export default function ParagraphDragTaskStudent({ task, onAnswer, readonly = false, value = {}, score, onScoreChange }: Props) {
  const blanks = task.blanks ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>(value);
  const [localScore, setLocalScore] = useState<number>(score ?? 0);

  // 🔒 parse paragraph ONCE (no infinite loop)
  const parts = useMemo(() => {
    if (!task.question) return [];

    return task.question.split(/(\{\{blank_\d+\}\})/g);
  }, [task.question]);

  useEffect(() => {
    setLocalScore(score ?? 0);
  }, [score]);

  const handleChange = (blankId: string, selected: string) => {
    const updated = { ...answers, [blankId]: selected };
    setAnswers(updated);
    onAnswer(task.id, updated);
  };

  if (!task.question || !Array.isArray(blanks)) {
    return <p className="text-red-500">Invalid task data</p>;
  }

  return (
    <div className="space-y-3">
      {/* <Label className="text-sm font-medium text-slate-700">
        Choose the correct answers
      </Label> */}

      <div className="leading-8 text-slate-800">
        {parts.map((part, index) => {
          const match = part.match(/\{\{(blank_\d+)\}\}/);

          if (!match) return <span key={index}>{part}</span>;

          const blankId = match[1];
          const blank = blanks.find((b) => b.id === blankId);

          if (!blank) return <span key={index}>____</span>;

          return (
            <select
              key={index}
              disabled={readonly}
              value={answers[blankId] ?? ''}
              onChange={(e) => handleChange(blankId, e.target.value)}
              className="mx-1 border px-2 py-1 rounded-xl bg-primary/60 text-slate-800"
            >
              <option value="" className="text-center text-slate-700">
                --Select--
              </option>
              {blank.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        })}
      </div>

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
