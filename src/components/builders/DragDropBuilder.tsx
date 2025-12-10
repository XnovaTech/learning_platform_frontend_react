import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { DragDropExtraData } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type Props = {
  initial?: DragDropExtraData | null;
  onChange: (data: DragDropExtraData) => void;
};

export default function DragDropBuilder({ initial, onChange }: Props) {
  const [question, setQuestion] = useState(initial?.question ?? '');
  const [items, setItems] = useState<string[]>(initial?.items ?? []);
  const [targets, setTargets] = useState<string[]>(initial?.targets ?? []);

  useEffect(() => {
    onChange({ question, items, targets });
  }, [ question, items, targets]);

  const addItem = () => (setItems((s) => [...s, '']), setTargets((s) => [...s, '']));
  // const addItem = () => setItems((s) => [...s, '']);
  //const addTarget = () => setTargets((s) => [...s, '']);

  const updateItem = (idx: number, val: string) => setItems((s) => s.map((it, i) => (i === idx ? val : it)));
  const updateTarget = (idx: number, val: string) => setTargets((s) => s.map((it, i) => (i === idx ? val : it)));

  const removeItem = (idx: number) => setItems((s) => s.filter((_, i) => i !== idx));
  const removeTarget = (idx: number) => setTargets((s) => s.filter((_, i) => i !== idx));

  const handleDragEndItems = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = Number(active.id.split('-')[1]);
    const newIndex = Number(over.id.split('-')[1]);
    setItems((i) => arrayMove(i, oldIndex, newIndex));
  };

  const handleDragEndTargets = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = Number(active.id.split('-')[1]);
    const newIndex = Number(over.id.split('-')[1]);
    setTargets((t) => arrayMove(t, oldIndex, newIndex));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className=' col-span-2'>
        <Label className=' font-medium mb-2'>Question</Label>
        <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} placeholder="Write long answer question here..." />
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium text-sm">Draggable Items</div>
          {/* <Button size="sm" onClick={addItem}>
            Add
          </Button> */}
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndItems}>
          <SortableContext items={items.map((_, i) => `I-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="p-2">
                    <GripVertical />
                  </div>
                  <Input value={it} onChange={(e) => updateItem(idx, e.target.value)} />
                  <Button variant="ghost" onClick={() => removeItem(idx)}>
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-sm">Targets (drop zones)</div>
          <Button size="sm" onClick={addItem}>
            Add
          </Button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndTargets}>
          <SortableContext items={targets.map((_, i) => `T-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {targets.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="p-2">
                    <GripVertical />
                  </div>
                  <Input value={t} onChange={(e) => updateTarget(idx, e.target.value)} />
                  <Button variant="ghost" onClick={() => removeTarget(idx)}>
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
