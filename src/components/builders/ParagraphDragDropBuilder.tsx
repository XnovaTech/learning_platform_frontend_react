import { useEffect, useState } from "react";
import type { ParagraphDropdownData } from "@/types/task";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { parseParagraphToBlanks } from "@/helper/paraseParagraphToBlanks";
import { Textarea } from "../ui/textarea";


type Props = {
  initial?: ParagraphDropdownData;
  onChange: (data: ParagraphDropdownData) => void;
};

export default function ParagraphDragDropBuilder({ initial, onChange}: Props){
  const [rawText, setRawText] = useState('');
  const [data, setData] = useState<ParagraphDropdownData>({
    paragraph:'',
    blanks: [],
  });

  // Initialize state
  useEffect(() => {
    if (initial?.paragraph){
      setData(initial);
      setRawText(initial.paragraph.replace(/\{\{blank_\d+\}\}/g, '__'));
    }
  }, [initial]);

  // Whenever data changes, notify parent
  useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  // Handle paragraph change and parse blanks
  const handleParagraphChange = (value: string) => {
    setRawText(value);
    const parsed = parseParagraphToBlanks(value, data.blanks);
    setData(parsed);
  };

  // Add a new option to a blank
  const addOption = (blankId: string) => {
    setData(prev => ({
      ...prev,
      blanks: prev.blanks.map(b => {
        if (b.id === blankId) {
          const newOptions = [...b.options, ''];
          const correct = b.correct || newOptions[0]; // auto set first option as correct
          return { ...b, options: newOptions, correct };
        }
        return b;
      }),
    }));
  };

  // Update option text
  const updateOption = (blankId: string, index: number, value: string) => {
    setData(prev => ({
      ...prev,
      blanks: prev.blanks.map(b =>
        b.id === blankId
          ? { ...b, options: b.options.map((o,i) => i===index ? value : o), correct: b.correct || value }
          : b
      )
    }));
  };

  // Set the correct option for a blank
  const setCorrect = (blankId: string, value: string) => {
    setData(prev => ({
      ...prev,
      blanks: prev.blanks.map(b =>
        b.id === blankId ? { ...b, correct: value } : b
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Paragraph Input */}
      <div>
        <Label className="mb-2 block">
          Paragraph (use <b>__</b> for blank)
        </Label>
        <Textarea
          className="w-full border rounded p-3 min-h-[120px]"
          value={rawText}
          onChange={(e) => handleParagraphChange(e.target.value)}
        />
      </div>

      {/* Blanks */}
      {data.blanks.map((blank, bIndex) => (
        <div key={blank.id} className="border rounded p-4 bg-white space-y-3">
          <Label className="font-semibold">Blank {bIndex + 1}</Label>

          {blank.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`blank-${blank.id}`} // same name for all options in this blank
                checked={blank.correct === opt}
                onChange={() => setCorrect(blank.id, opt)}
              />
              <Input
                value={opt}
                placeholder={`Option ${i + 1}`}
                onChange={(e) => updateOption(blank.id, i, e.target.value)}
              />
            </div>
          ))}

          <Button type="button" variant="outline" onClick={() => addOption(blank.id)}>
            + Add Option
          </Button>
        </div>
      ))}
    </div>
  );
}
