import { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

type Props = {
  initial?: { min_word_count?: number };
  onChange: (data: { min_word_count: number }) => void;
};

export default function LongAnswerBuilder({ initial, onChange }: Props) {
  const [minWords, setMinWords] = useState<number>(initial?.min_word_count ?? 0);

  useEffect(() => {
    onChange({
      min_word_count: Number(minWords),
    });
  }, [ minWords]);

  return (
    <div className="space-y-3">
   
      <div>
        <Label className="font-medium mb-2">Minimum Word Count</Label>
        <Input value={minWords} onChange={(e) => setMinWords(Number(e.target.value))} placeholder="e.g. 150" />
        <p className="text-sm text-gray-500 mt-1">Students must write at least this many words.</p>
      </div>
    </div>
  );
}
