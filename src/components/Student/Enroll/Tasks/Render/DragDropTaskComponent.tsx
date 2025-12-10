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
  DragOverEvent,
} from "@dnd-kit/core";

import type { LessonTaskType } from "@/types/task";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DragDropTaskComponentProps {
  task: LessonTaskType;
  onAnswer: (value: any) => void;
}

export default function DragDropTaskComponent({
  task,
  onAnswer,
}: DragDropTaskComponentProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string | null>>({});

  const items = task.items ?? [];
  const targets = task.targets ?? [];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const itemId = active.id.toString();
    const targetId = over.id.toString();

    const alreadyUsed = Object.values(assigned).includes(itemId);
    if (alreadyUsed) return;

    setAssigned((prev) => {
      const newState = { ...prev, [targetId]: itemId };
      onAnswer(newState);
      return newState;
    });
  };

  const reset = () => {
    setAssigned({});
    onAnswer({});
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* ITEMS */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Items</h3>

            {items
              .filter(
                (item) => !Object.values(assigned).includes(item.id.toString())
              )
              .map((item) => (
                <DraggableItem
                  key={item.id}
                  id={item.id.toString()}
                  text={item.text}
                />
              ))}
          </div>

          {/* DROP TARGETS */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Targets</h3>

            {targets.map((target) => (
              <DropZone
                key={target.id}
                id={target.id.toString()}
                text={target.text}
                assignedItem={assigned[target.id]}
                items={items}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}

/* --------------------------
   DRAGGABLE ITEM
--------------------------- */
function DraggableItem({ id, text }: { id: string; text: string }) {
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
      {...listeners}
      {...attributes}
      className="p-3 rounded-xl border bg-blue-100 shadow-sm cursor-grab active:cursor-grabbing transition"
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
}: {
  id: string;
  text: string;
  assignedItem: string | null | undefined;
  items: any[];
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
        isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50",
        matchedItem && "border-green-500 bg-green-50"
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
