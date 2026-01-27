import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {  useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { LessonTaskType } from '@/types/task';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface TableDragTaskComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer: (taskId: number, value: any) => void;
  value?: Record<string, string | null>;
  readonly?: boolean;
}

interface Item {
  id: string;
  text: string;
}

interface Row {
  id: string;
  claim: string;
  evidences: string[];
}

export default function TableDragTaskComponent({
  task,
  onAnswer,
  value = {},
  readonly = false,
}: TableDragTaskComponentProps) {
  const sensors = readonly ? undefined : useSensors(useSensor(PointerSensor));
  const [assigned, setAssigned] = useState<Record<string, string | null>>(
  () => value ?? {}
);


  const items: Item[] = [];
  const rows: Row[] = [];

  const taskWithTableDrag = task as any;

  /* ----------------------------
     PARSE BACKEND RESPONSE
  ----------------------------- */
  if (taskWithTableDrag.items && taskWithTableDrag.rows) {
 
    taskWithTableDrag.items.forEach((item: any) => {
      items.push({
        id: String(item.id),
        text: item.text,
      });
    });

  
    taskWithTableDrag.rows.forEach((row: any) => {
      rows.push({
        id: String(row.id),
        claim: row.claim,
        evidences: row.evidences.map((e: any) =>
          typeof e === 'object' ? e.text : e
        ),
      });
    });
  }

  const remainingItems = items.filter(
    (item) => !Object.values(assigned).includes(item.id)
  );

  const handleDragStart = (_: DragStartEvent) => {
    if (readonly) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (readonly) return;

    const { active, over } = event;
    if (!over) return;

    const itemId = String(active.id);
    const targetId = String(over.id);

    if (Object.values(assigned).includes(itemId)) return;

    const newState = { ...assigned, [targetId]: itemId };
    setAssigned(newState);
    onAnswer?.(task.id, newState);
  };

  // useEffect(() => {
  //   if (value) setAssigned(value);
  // }, [value]);

  const reset = () => {
    if (readonly) return;
    setAssigned({});
    onAnswer?.(task.id, {});
  };

  return (
    <div className="space-y-6">
  {!readonly && (
    <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-2 shadow-sm">
      <p className="text-sm font-medium text-slate-600">
        Drag items into the correct evidence cells
      </p>

      <Button size="sm" variant="outline" onClick={reset} className="gap-2">
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>
  )}

  <DndContext
    sensors={sensors}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  >
    <div className="rounded-2xl border bg-gradient-to-b from-slate-50 to-white p-6 shadow-md space-y-6">

      {/* DRAG ITEMS */}
      <div className="rounded-xl border bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">
          Available Items
        </h4>

        <div className="flex flex-wrap gap-3">
          {remainingItems.map(item => (
            <DraggableItem
              key={item.id}
              id={item.id}
              text={item.text}
              readOnly={readonly}
            />
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold w-1/3">
                Claim
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Evidence
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rows.map(row => (
              <tr key={row.id} className="align-top">
                <td className="px-4 py-4 font-medium text-slate-800">
                  {row.claim}
                </td>

                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-3">
                    {row.evidences.map((ev, index) => {
                      const dropId = `${row.id}-E-${index}`;

                      return (
                        <DropZone
                          key={dropId}
                          id={dropId}
                          text={ev}
                          assignedItem={assigned[dropId]}
                          items={items}
                          readOnly={readonly}
                        />
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DndContext>
</div>

  );
}

/* ----------------------------
   DRAGGABLE ITEM
----------------------------- */
function DraggableItem({ id, text, readOnly }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...(!readOnly ? { ...attributes, ...listeners } : {})}
      className={cn(
        'select-none rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-all',
        'hover:-translate-y-0.5 hover:shadow-md',
        !readOnly && 'cursor-grab active:cursor-grabbing',
        readOnly && 'opacity-60 cursor-not-allowed'
      )}
    >
      {text}
    </div>
  );
}


/* ----------------------------
   DROP ZONE
----------------------------- */
function DropZone({ id, text, assignedItem, items, readOnly }: any) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const matched = items.find((i:any) => i.id === assignedItem);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-w-[160px] rounded-lg border-2 border-dashed p-3 transition-all',
        matched
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-slate-300 bg-white',
        isOver && !readOnly && 'ring-4 ring-emerald-200'
      )}
    >
      <div className="mb-1 text-xs text-slate-500">
        {text}
      </div>

      {matched ? (
        <div className="rounded-md bg-white px-2 py-1 text-sm font-medium shadow-sm">
          {matched.text}
        </div>
      ) : (
        <div className="text-center text-xs italic text-slate-400">
          Drop here
        </div>
      )}
    </div>
  );
}

