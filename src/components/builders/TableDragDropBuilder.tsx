import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TableDragDropExtraData } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Plus } from 'lucide-react';

type Props = {
  initial?: TableDragDropExtraData | null;
  onChange: (data: TableDragDropExtraData) => void;
};

export default function TableDragDropBuilder({ initial, onChange }: Props) {
  const [items, setItems] = useState<string[]>(initial?.items ?? []);
  const [rows, setRows] = useState<TableDragDropExtraData['rows']>(initial?.rows ?? []);

  useEffect(() => {
    onChange({ items, rows });
  }, [items, rows]);

  const addItem = () => setItems((s) => [...s, '']);

  const addRow = () => {
    setRows((s) => [...s, { id: Date.now().toString(), claim: '', evidences: [] }]);
  };

  const updateItem = (idx: number, val: string) => setItems((s) => s.map((it, i) => (i === idx ? val : it)));

  const updateRowClaim = (rowId: string, val: string) => {
    setRows((s) => s.map((row) => (row.id === rowId ? { ...row, claim: val } : row)));
  };

  const addEvidence = (rowId: string) => {
    setRows((s) => s.map((row) => (row.id === rowId ? { ...row, evidences: [...row.evidences, ''] } : row)));
  };

  const updateEvidence = (rowId: string, evidenceIdx: number, val: string) => {
    setRows((s) => s.map((row) => {
      if (row.id === rowId) {
        const newEvidences = row.evidences.map((ev, i) => (i === evidenceIdx ? val : ev));
        return { ...row, evidences: newEvidences };
      }
      return row;
    }));
  };

  const removeItem = (idx: number) => setItems((s) => s.filter((_, i) => i !== idx));

  const removeRow = (rowId: string) => setRows((s) => s.filter((row) => row.id !== rowId));

  const removeEvidence = (rowId: string, evidenceIdx: number) => {
    setRows((s) => s.map((row) => {
      if (row.id === rowId) {
        const newEvidences = row.evidences.filter((_, i) => i !== evidenceIdx);
        return { ...row, evidences: newEvidences };
      }
      return row;
    }));
  };

  const handleDragEndItems = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = Number(active.id.split('-')[1]);
    const newIndex = Number(over.id.split('-')[1]);
    setItems((i) => arrayMove(i, oldIndex, newIndex));
  };

  const handleDragEndRows = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = rows.findIndex(row => row.id === active.id);
    const newIndex = rows.findIndex(row => row.id === over.id);
    setRows((r) => arrayMove(r, oldIndex, newIndex));
  };

  const handleDragEndEvidences = (event: any, rowId: string) => {
    const { active, over } = event;
    if (!over) return;
    const row = rows.find(r => r.id === rowId);
    if (!row) return;
    const oldIndex = Number(active.id.split('-')[1]);
    const newIndex = Number(over.id.split('-')[1]);
    const newEvidences = arrayMove(row.evidences, oldIndex, newIndex);
    setRows((s) => s.map((row) => (row.id === rowId ? { ...row, evidences: newEvidences } : row)));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-sm">Draggable Items</div>
          <Button size="sm" onClick={addItem}>
            Add Item
          </Button>
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
          <div className="font-medium text-sm">Table Rows</div>
          <Button size="sm" onClick={addRow}>
            Add Row
          </Button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndRows}>
          <SortableContext items={rows.map(row => row.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {rows.map((row) => (
                <div key={row.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2">
                      <GripVertical />
                    </div>
                    <Input
                      value={row.claim}
                      onChange={(e) => updateRowClaim(row.id, e.target.value)}
                      placeholder="Claim"
                    />
                    <Button variant="ghost" onClick={() => removeRow(row.id)}>
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="ml-6 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-xs text-gray-600">Evidences</div>
                      <Button size="sm" variant="outline" onClick={() => addEvidence(row.id)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Evidence
                      </Button>
                    </div>

                    <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEndEvidences(e, row.id)}>
                      <SortableContext items={row.evidences.map((_, i) => `E-${row.id}-${i}`)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {row.evidences.map((ev, evIdx) => (
                            <div key={evIdx} className="flex items-center gap-2 ml-4">
                              <div className="p-2">
                                <GripVertical />
                              </div>
                              <Input
                                value={ev}
                                onChange={(e) => updateEvidence(row.id, evIdx, e.target.value)}
                                placeholder="Evidence"
                              />
                              <Button variant="ghost" onClick={() => removeEvidence(row.id, evIdx)}>
                                <Trash2 />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}