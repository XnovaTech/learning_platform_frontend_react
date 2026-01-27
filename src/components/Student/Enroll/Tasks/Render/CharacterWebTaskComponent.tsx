import { DndContext, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { LessonTaskType } from '@/types/task';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CharacterWebTaskComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: any) => void;
  value?: Record<string, string | null>;
  readonly?: boolean;
    score?: number;
  onScoreChange?: (taskId: number, score: number) => void;
}

export default function CharacterWebTaskComponent({ task, onAnswer, value = {}, readonly = false ,score, onScoreChange }: CharacterWebTaskComponentProps) {
  const sensors = readonly ? undefined : useSensors(useSensor(PointerSensor));
  const [assigned, setAssigned] = useState<Record<string, string | null>>(value);
  const [localScore, setLocalScore] = useState<string>(score ? score.toString() : '');

  // Parse options into center label and targets
  const [centerLabel, setCenterLabel] = useState<string>('');
  const [targets, setTargets] = useState<{ text: string; is_correct: number }[]>([]);

  // If task has extra_data (from builder), use it directly
  const taskWithCharacterWeb = task as any;
  useEffect(() => {
    if (taskWithCharacterWeb.extra_data) {
      const extraData = taskWithCharacterWeb.extra_data as any;
      setCenterLabel(extraData.center_label || '');
      setTargets(extraData.targets || []);
    } else if (taskWithCharacterWeb.center && taskWithCharacterWeb.items) {
      // New format: center object and items array
      setCenterLabel(taskWithCharacterWeb.center.text || '');
      setTargets(taskWithCharacterWeb.items.map((item: any) => ({
        text: item.text,
        is_correct: 0 // Default to 0 for student view
      })));
    } else {
      // Fallback to parsing options (for backward compatibility)
      let parsedCenterLabel = '';
      const parsedTargets: { text: string; is_correct: number }[] = [];
      
      task.options?.forEach((opt) => {
        if (opt.pair_key === 'center') {
          parsedCenterLabel = opt.option_text;
        } else if (opt.pair_key?.startsWith('T')) {
          const index = Number(opt.pair_key.replace('T', ''));
          while (parsedTargets.length <= index) {
            parsedTargets.push({ text: '', is_correct: 0 });
          }
          parsedTargets[index] = { text: opt.option_text, is_correct: opt.is_correct ? 1 : 0 };
        }
      });
      
      setCenterLabel(parsedCenterLabel);
      setTargets(parsedTargets);
    }
  }, [task]);

  
  useEffect(() => {
    setLocalScore(score ? score.toString() : '');
  }, [score]);

  const remainingTargets = targets.filter((target) => !Object.values(assigned).includes(target.text));

  const allTargetsDropped = remainingTargets.length === 0;

  const handleDragEnd = (event: DragEndEvent) => {
    if (readonly) return;

    const { active, over } = event;

    if (!over) return;

    const targetId = active.id.toString();
    const circleId = over.id.toString();

    const alreadyUsed = Object.values(assigned).includes(targetId);
    if (alreadyUsed) return;

    setAssigned((prev) => {
      const newState = { ...prev, [circleId]: targetId };
      onAnswer(task.id, newState);
      return newState;
    });
  };

  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      setAssigned(value);
    }
  }, [value]);

  const reset = () => {
    if (readonly) return;
    setAssigned({});
    onAnswer(task.id, {});
  };

  return (
  <div className="space-y-6">
    {!readonly && (
      <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-2 shadow-sm">
        <p className="text-sm font-medium text-slate-600">
          Drag the correct targets into the circles
        </p>

        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          type="button"
          onClick={reset}
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>
    )}

    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="rounded-2xl border bg-linear-to-b from-slate-50 to-white p-6 shadow-md space-y-8">

        {/* CENTER LABEL */}
        <div className="flex justify-center">
          <div className="rounded-full border bg-white px-8 py-3 shadow-sm">
            <span className="text-lg font-semibold text-slate-800">
              {centerLabel || 'Center'}
            </span>
          </div>
        </div>

        {/* DROP ZONES */}
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from(
            { length: (task as any).total_correct || targets.filter(t => t.is_correct === 1).length },
            (_, index) => {
              const circleId = `circle-${index}`;
              const assignedTarget = targets.find(
                target => assigned[circleId] === target.text
              )?.text;

              return (
                <DropZone
                  key={circleId}
                  id={circleId}
                  index={index + 1}
                  assignedTarget={assignedTarget}
                  readOnly={readonly}
                />
              );
            }
          )}
        </div>

        {/* TARGETS */}
        {!allTargetsDropped && (
          <div className="rounded-xl border-t pt-6">
            <div className="flex flex-wrap justify-center gap-3">
              {remainingTargets.map(target => (
                <DraggableTarget
                  key={target.text}
                  id={target.text}
                  text={target.text}
                  readOnly={readonly}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DndContext>

    
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

/* --------------------------
   DRAGGABLE TARGET
--------------------------- */
function DraggableTarget({ id, text, readOnly }: { id: string; text: string; readOnly?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...(!readOnly ? { ...listeners, ...attributes } : {})}
      className={cn(
        'select-none rounded-full border bg-white px-5 py-2 text-sm font-medium shadow-sm transition-all',
        'hover:shadow-md hover:-translate-y-0.5',
        !readOnly && 'cursor-grab active:cursor-grabbing',
        readOnly && 'opacity-60 cursor-not-allowed'
      )}
    >
      {text}
    </div>
  );
}


/* --------------------------
   DROP ZONE (CIRCLE)
--------------------------- */
function DropZone({
  id,
  index,
  assignedTarget,
  readOnly,
}: {
  id: string;
  index: number;
  assignedTarget?: string;
  readOnly?: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed transition-all',
        assignedTarget
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-slate-300 bg-white',
        isOver && !readOnly && 'ring-4 ring-emerald-200',
        readOnly && 'cursor-not-allowed'
      )}
    >
      {assignedTarget ? (
        <span className="text-sm font-semibold text-emerald-700 text-center px-2">
          {assignedTarget}
        </span>
      ) : (
        <span className="text-sm text-slate-400">{index}</span>
      )}
    </div>
  );
}
