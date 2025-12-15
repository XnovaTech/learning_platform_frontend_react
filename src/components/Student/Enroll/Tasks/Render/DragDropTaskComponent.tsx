import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type {
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import type { LessonTaskType } from "@/types/task";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DragDropTaskComponentProps {
  task: LessonTaskType;
  onAnswer: (taskId: number, value: any) => void;
  value?: Record<string, string | null>;
  readonly?: boolean
}

export default function DragDropTaskComponent({
  task,
  onAnswer,
  value = {},
  readonly = false,
}: DragDropTaskComponentProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string | null>>(value);

  const items = task.items ?? [];
  const targets = task.targets ?? [];

  console.log(activeId);
  const handleDragStart = (event: DragStartEvent) => {
    if (readonly) return;
    setActiveId(event.active.id.toString());
  };

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

  const reset = () => {
    if (readonly) return;
    setAssigned({});
    onAnswer(task.id, {});
  };

  return (
    <div className="p-4 space-y-4">
      {
        !readonly && (
            <div className="flex justify-end">
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
        )
      }
      

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6 bg-primary/5 p-6 rounded-xl">
          {/* ITEMS */}
          <div className="space-y-3 mb-3 border-b pb-4">
            <h3 className="font-semibold text-lg">Items</h3>

            <div className=" flex flex-wrap gap-3 w-full">
                 {items
              .filter(
                (item) => !Object.values(assigned).includes(item.id.toString())
              )
              .map((item) => (
                <DraggableItem
                  key={item.id}
                  id={item.id.toString()}
                  text={item.text}
                  readOnly = {readonly}
                />
              ))}
            </div>
         
          </div>

          {/* DROP TARGETS */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Targets</h3>

              <div className=" flex flex-wrap gap-3">
            {targets.map((target) => (
              <DropZone
                key={target.id}
                id={target.id.toString()}
                text={target.text}
                assignedItem={assigned[target.id]}
                items={items}
                readOnly={readonly}
              />
            ))}
            </div>
          </div>
        </div>
      </DndContext>
      {!readonly && <small className="text-sm font-semibold text-gray-700">* Note - Please Drag items to targets</small>}
    </div>
  );
}

/* --------------------------
   DRAGGABLE ITEM
--------------------------- */
function DraggableItem({ id, text , readOnly}: { id: string; text: string, readOnly?: boolean }) {
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
      className={cn(
        "p-3 rounded-xl border bg-blue-100 shadow-sm transition",
        !readOnly && "cursor-grab active:cursor-grabbing",
        readOnly && "opacity-70 cursor-not-allowed"
      )}
    >
      {text}
    </div>
  );
}

/* --------------------------
   DROP ZONE
--------------------------- */
function DropZone({
  id,
  text,
  assignedItem,
  items,
  readOnly
}: {
  id: string;
  text: string;
  assignedItem: string | null | undefined;
  items: any[];
  readOnly?: boolean
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const matchedItem = items.find((i) => i.id.toString() === assignedItem);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 min-h-20 border-2 border-dashed rounded-xl transition",
        isOver && !readOnly ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50",
        matchedItem && "border-green-500 bg-green-50",
        readOnly && "cursor-not-allowed"
      )}
    >
      <div className="text-gray-600 text-sm">{text}</div>

      <div className="mt-2">
        {matchedItem ? (
          <div className="p-2 bg-green-100 border rounded shadow-sm">
            {matchedItem.text}
          </div>
        ) : (
          <div className="text-gray-400 italic text-sm">Drop here…</div>
        )}
      </div>
    </div>
  );
}
