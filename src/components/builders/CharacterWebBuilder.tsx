import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';


interface CharacterWebBuilderProps {
  initial?: {
    center_label?: string;
    targets?: { text: string; is_correct: number }[];
  };
  onChange: (data: { center_label: string; targets: { text: string; is_correct: number }[] }) => void;
}

export default function CharacterWebBuilder({ initial, onChange }: CharacterWebBuilderProps) {
  const [centerLabel, setCenterLabel] = useState(initial?.center_label || '');
  const [targets, setTargets] = useState<{ text: string; is_correct: number }[]>(initial?.targets || []);

  useEffect(() => {
    onChange({ center_label: centerLabel, targets });
  }, [centerLabel, targets, onChange]);

  const addTarget = () => {
    setTargets([...targets, { text: '', is_correct: 1 }]);
  };

  const updateTarget = (index: number, value: string) => {
    const newTargets = [...targets];
    newTargets[index] = { ...newTargets[index], text: value };
    setTargets(newTargets);
  };

  const updateTargetCorrect = (index: number, is_correct: number) => {
    const newTargets = [...targets];
    newTargets[index] = { ...newTargets[index], is_correct };
    setTargets(newTargets);
  };

  const removeTarget = (index: number) => {
    const newTargets = targets.filter((_, i) => i !== index);
    setTargets(newTargets);
  };

  // const moveTarget = (fromIndex: number, toIndex: number) => {
  //   if (toIndex < 0 || toIndex >= targets.length) return;
    
  //   const newTargets = [...targets];
  //   const [movedItem] = newTargets.splice(fromIndex, 1);
  //   newTargets.splice(toIndex, 0, movedItem);
  //   setTargets(newTargets);
  // };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="center-label">Center Label</Label>
        <Input
          id="center-label"
          value={centerLabel}
          onChange={(e) => setCenterLabel(e.target.value)}
          placeholder="Enter center label (e.g., Main Character)"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Targets</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTarget}>
            <Plus className="mr-2 h-4 w-4" />
            Add Target
          </Button>
        </div>

        <div className="space-y-2">
          {targets.map((target, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <Input
                value={target.text}
                onChange={(e) => updateTarget(index, e.target.value)}
                placeholder={`Target ${index + 1}`}
                className="flex-1"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={target.is_correct === 1}
                  onCheckedChange={(checked) => updateTargetCorrect(index, checked ? 1 : 0)}
                />
                <Label className="text-sm">Correct</Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTarget(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}