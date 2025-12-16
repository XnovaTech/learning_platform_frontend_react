import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Trash2 } from 'lucide-react';

type Blank = {
  id: number;
  value: string;
};

type DragDropExtraData = {
  paragraph: string;
  blanks: Blank[];
  items: string[];
};

type Props = {
  initial?: DragDropExtraData | null;
  onChange: (data: DragDropExtraData) => void;
};

export default function DragDropWithBlankBuilder({ initial, onChange }: Props) {
  const [paragraph, setParagraph] = useState(initial?.paragraph ?? '');
  const [items, setItems] = useState<string[]>(initial?.items ?? []);
  const [blanks, setBlanks] = useState<Blank[]>(initial?.blanks ?? []);

  // sync changes
  useEffect(() => {
    onChange({ paragraph, items, blanks });
  }, [paragraph, items, blanks]);

  // add new draggable item
  const addItem = () => setItems((s) => [...s, '']);

  const updateItem = (idx: number, val: string) =>
    setItems((s) => s.map((it, i) => (i === idx ? val : it)));
  const removeItem = (idx: number) => setItems((s) => s.filter((_, i) => i !== idx));

  // add blank (optional: for manual blank creation)
  const addBlank = () => setBlanks((s) => [...s, { id: s.length, value: '' }]);
  const updateBlank = (idx: number, val: string) =>
    setBlanks((s) => s.map((b, i) => (i === idx ? { ...b, value: val } : b)));
  const removeBlank = (idx: number) => setBlanks((s) => s.filter((_, i) => i !== idx));

  // Render paragraph with blanks
  const renderParagraph = () => {
    const parts = paragraph.split(/(\{\d+\})/g); // split by {0}, {1}, etc.
    return parts.map((part, idx) => {
      const match = part.match(/\{(\d+)\}/);
      if (match) {
        const blankIndex = Number(match[1]);
        const blank = blanks[blankIndex];
        return (
          <DropZone
            key={idx}
            value={blank?.value ?? ''}
            onDrop={(val) => updateBlank(blankIndex, val)}
          />
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Paragraph Editor */}
      <div className="col-span-2">
        <Label className="font-medium mb-2">Paragraph</Label>
        <Textarea
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
          rows={6}
          placeholder="Write paragraph here. Use {0}, {1}, etc. for blanks."
        />
        <div className="mt-4">
          <Label className="font-medium mb-2">Preview</Label>
          <div className="p-4 border rounded bg-gray-50">{renderParagraph()}</div>
        </div>
      </div>

      {/* Draggable Items */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="font-medium text-sm">Draggable Items</Label>
          <Button size="sm" onClick={addItem}>
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
                placeholder="Item text"
              />
              <Button variant="ghost" onClick={() => removeItem(idx)}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Blanks (optional management UI) */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="font-medium text-sm">Blanks</Label>
          <Button size="sm" onClick={addBlank}>
            Add Blank
          </Button>
        </div>
        <div className="space-y-2">
          {blanks.map((blank, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={blank.value}
                onChange={(e) => updateBlank(idx, e.target.value)}
                placeholder={`Blank #${idx}`}
              />
              <Button variant="ghost" onClick={() => removeBlank(idx)}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// DropZone Component
function DropZone({ value, onDrop }: { value: string; onDrop: (val: string) => void }) {
  return (
    <div
      className="inline-block px-2 py-1 border-b border-gray-400 min-w-[50px] cursor-pointer hover:bg-gray-100"
      onClick={() => onDrop('')}
      onDrop={(e) => {
        e.preventDefault();
        const val = e.dataTransfer.getData('text/plain');
        onDrop(val);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {value || '__'}
    </div>
  );
}
