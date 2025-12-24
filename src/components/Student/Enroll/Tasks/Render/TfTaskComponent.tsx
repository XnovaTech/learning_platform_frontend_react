import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { LessonTaskType } from '@/types/task';

interface TfTaskComponentProps {
  task: LessonTaskType;
  onAnswer: (taskId: number, value: any) => void;
  value?: string;
  readonly?: boolean;
}

const dataList = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
];

export default function TfTaskComponent({ task, onAnswer, value, readonly }: TfTaskComponentProps) {
  return (
    <RadioGroup value={value?.toString()} onValueChange={(v) => !readonly && onAnswer(task.id, v)} className="flex flex-col flex-wrap gap-4">
      {dataList.map((data) => (
        <Label
          key={data.value}
          htmlFor={`${data.value}-${task.id}`}
          className="flex items-center  space-x-3 p-3 border w-full md:w-44 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100"
        >
          <RadioGroupItem value={data.value} id={`${data.value}-${task.id}`} disabled={readonly} />
          <span className="text-gray-700">{data.label}</span>
        </Label>
      ))}
    </RadioGroup>
  );
}
