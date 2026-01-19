import { DndContext, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

import type { CourseExamType, LessonTaskType } from '@/types/task';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface DragDropTaskComponentProps {
  task: LessonTaskType | CourseExamType;
  onAnswer: (taskId: number, value: any) => void;
  value?: Record<string, string | null>;
  readonly?: boolean;
}

export default function DragDropTaskComponent({ task, onAnswer, value = {}, readonly = false }: DragDropTaskComponentProps) {
  const sensors = readonly ? undefined : useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string | null>>(value);

  const items = task.items ?? [];
  const targets = task.targets ?? [];

  const remainingItems = items.filter((item) => !Object.values(assigned).includes(item.id.toString()));

  const allItemsDropped = remainingItems.length === 0;

  const handleDragStart = (event: DragStartEvent) => {
    if (readonly) return;
    setActiveId(event.active.id.toString());
  };

  console.log(activeId);

  const handleDragEnd = (event: DragEndEvent) => {
    if (readonly) return;

    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const itemId = active.id.toString();
    const targetId = over.id.toString();

    const alreadyUsed = Object.values(assigned).includes(itemId);
    if (alreadyUsed) return;

    setAssigned((prev) => {
      const newState = { ...prev, [targetId]: itemId };
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
    <div className="space-y-4">
      {!readonly && (
        <div className="flex items-center justify-between">
          <small className="text-sm font-semibold text-red-600">* Note - Please Drag items to targets</small>

          <Button size="sm" variant="red" className="text-sm md:text-base" type="button" onClick={reset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      )}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="space-y-5 bg-primary/5 py-2 px-4 rounded-xl">
          {/* ITEMS */}
          <div className={cn('space-y-3 mb-3', !allItemsDropped && 'border-b pb-4')}>
            <div className="flex flex-wrap gap-3 w-full">
              {remainingItems.map((item) => (
                <DraggableItem key={item.id} id={item.id.toString()} text={item.text} readOnly={readonly} />
              ))}
            </div>
          </div>

          {/* DROP TARGETS */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Targets</h3>

            <div className="flex flex-wrap gap-3">
              {targets.map((target) => (
                <DropZone key={target.id} id={target.id.toString()} text={target.text} assignedItem={assigned[target.id]} items={items} readOnly={readonly} />
              ))}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}

/* --------------------------
   DRAGGABLE ITEM
--------------------------- */
function DraggableItem({ id, text, readOnly }: { id: string; text: string; readOnly?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!readOnly ? { ...listeners, ...attributes } : {})}
      className={cn('p-3 rounded-lg bg-green-100 border-green-500 text-green-700 shadow-sm transition', !readOnly && 'cursor-grab active:cursor-grabbing', readOnly && 'opacity-70 cursor-not-allowed')}
    >
      {text}
    </div>
  );
}

/* --------------------------
   DROP ZONE
--------------------------- */
function DropZone({ id, text, assignedItem, items, readOnly }: { id: string; text: string; assignedItem: string | null | undefined; items: any[]; readOnly?: boolean }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const matchedItem = items.find((i) => i.id.toString() === assignedItem);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'p-4 w-full md:w-fit min-h-20 border-2 border-dashed rounded-xl transition',
        isOver && !readOnly ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50',
        matchedItem && 'border-green-500 bg-green-50',
        readOnly && 'cursor-not-allowed'
      )}
    >
      <div className="text-gray-600 text-sm">{text}</div>

      <div className="mt-2">
        {matchedItem ? <div className="p-2 bg-green-100 border-green-500 text-green-700  rounded-lg shadow-sm">{matchedItem.text}</div> : <div className="text-gray-400 italic text-sm">Drop here…</div>}
      </div>
    </div>
  );
}
