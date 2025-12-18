import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

type Props = {
  initial?: {
    correct_answer?: string;
  };

  onChange: (data: { correct_answer: string }) => void;
};

export default function TrueFalseBuilder({ initial, onChange }: Props) {

  const [correctAnswer, setCorrectAnswer] = useState(
    initial?.correct_answer ? initial.correct_answer === 'true' : true);

  useEffect(() => {
    onChange({  correct_answer: correctAnswer ? "true" : "false" });
  }, [correctAnswer]);

  return (
    <div className="space-y-4">
      <div>
        <Label className=' mb-2 font-medium'>Correct Answer</Label>
        <RadioGroup value={correctAnswer ? 'true' : 'false'} onValueChange={(val) => setCorrectAnswer(val === 'true')} className="flex gap-4 mt-1">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="true" id="tf-true" />
            <Label htmlFor="tf-true">True</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="false" id="tf-false" />
            <Label htmlFor="tf-false">False</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
