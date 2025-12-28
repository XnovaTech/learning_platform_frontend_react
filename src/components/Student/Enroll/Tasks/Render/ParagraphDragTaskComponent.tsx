import { useMemo, useState } from "react";
// import { Label } from "@/components/ui/label";
import type { LessonTaskType } from "@/types/task";

interface Props {
  task: LessonTaskType;
  onAnswer: (taskId: number, value: Record<string, string>) => void;
  readonly?: boolean;
  value?: Record<string, string>;
}

export default function ParagraphDragTaskStudent({
  task,
  onAnswer,
  readonly = false,
  value = {},
}: Props) {
  const blanks = task.blanks ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>(value);

  // 🔒 parse paragraph ONCE (no infinite loop)
  const parts = useMemo(() => {
    if (!task.question) return [];

    return task.question.split(/(\{\{blank_\d+\}\})/g);
  }, [task.question]);

  const handleChange = (blankId: string, selected: string) => {
    const updated = { ...answers, [blankId]: selected };
    setAnswers(updated);
    onAnswer(task.id, updated);
  };

  if (!task.question || !Array.isArray(blanks)) {
    return <p className="text-red-500">Invalid task data</p>;
  }

  return (
    <div className="space-y-4">
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
              value={answers[blankId] ?? ""}
              onChange={(e) => handleChange(blankId, e.target.value)}
              className="mx-1 rounded border px-2 py-1"
            >
              <option value="">---</option>
              {blank.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        })}
      </div>
    </div>
  );
}
