import { useState, useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

type Props = {
  initial?: {
    question?: string;
    extra_data?: { min_word_count?: number };
  };
  onChange: (data: { question: string; extra_data: { min_word_count: number } }) => void;
};

export default function LongAnswerBuilder({ initial, onChange }: Props) {
  const [question, setQuestion] = useState(initial?.question ?? '');
  const [minWords, setMinWords] = useState<number>(initial?.extra_data?.min_word_count ?? 0);

  useEffect(() => {
    onChange({
      question,
      extra_data: { min_word_count: Number(minWords) },
    });
  }, [question, minWords]);

  return (
    <div className="space-y-3">
      <div>
        <Label>Question</Label>
        <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} placeholder="Write long answer question here..." />
      </div>
      <div>
        <Label className="font-medium">Minimum Word Count</Label>
        <Input type="number" min={0} value={minWords} onChange={(e) => setMinWords(Number(e.target.value))} placeholder="e.g. 150" />
        <p className="text-sm text-gray-500 mt-1">Students must write at least this many words.</p>
      </div>
    </div>
  );
}
