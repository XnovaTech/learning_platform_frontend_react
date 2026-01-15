import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { LessonTaskType, CourseExamType } from '@/types/task';
import { cn } from '@/lib/utils';

interface McqTaskComponentProps {
  task: LessonTaskType | CourseExamType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
}



export default function McqTaskComponent({ task, onAnswer, value, readonly = false }: McqTaskComponentProps) {
  return (
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
  );
}
