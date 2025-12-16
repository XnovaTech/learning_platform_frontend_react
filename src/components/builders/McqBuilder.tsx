import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Trash2 } from 'lucide-react';

type MCQOption = {
  option_text: string;
  is_correct: boolean;
};

type Props = {
  initial?: {
    options?: MCQOption[];
  };

  onChange: (data: { options: MCQOption[] }) => void;
};

export default function McqBuilder({ initial, onChange }: Props) {

  const [options, setOptions] = useState<MCQOption[]>(initial?.options ?? [{ option_text: '', is_correct: false }]);

  useEffect(() => {
    onChange({ options });
  }, [options]);

  const addOption = () => {
    setOptions((s) => [...s, { option_text: '', is_correct: false }]);
  };

  const updateOption = (i: number, key: keyof MCQOption, value: any) => {
    setOptions((s) => s.map((o, idx) => (idx === i ? { ...o, [key]: value } : o)));
  };

  const removeOption = (i: number) => {
    setOptions((s) => s.filter((_, idx) => idx !== i));
  };

  const handleCorrectClick = (index: number) => {
    setOptions((prev) => 
        prev.map((opt, i) => ({
            ...opt,
            is_correct: i === index ? true : false
        }))
    )
  }

  return (
    <div className="space-y-4">

      <div className="font-medium text-sm">Options</div>

      <div className="space-y-3">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <Checkbox
              checked={opt.is_correct}
              onCheckedChange={() => handleCorrectClick(i)}
            />
            <p>{i + 1}. </p>
            <Input className="flex-1" value={opt.option_text} onChange={(e) => updateOption(i, 'option_text', e.target.value)} placeholder={`Option ${i + 1}`} />

            <Button variant="ghost" onClick={() => removeOption(i)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button size="sm" onClick={addOption}>
        Add Option
      </Button>
    </div>
  );
}
