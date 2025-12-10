import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { LessonTaskType } from "@/types/task";

interface McqTaskComponentProps {
    task: LessonTaskType;
    onAnswer: any;
}

export default function McqTaskComponent({task, onAnswer}: McqTaskComponentProps) {
    return (
        <RadioGroup
            onValueChange={v => onAnswer(task.id, v)}
            className="space-y-3 flex flex-row">
                {task?.options?.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-3">
                        <RadioGroupItem
                            value={opt.id.toString()}
                            id={`mcq-${opt.id}`} />

                        <Label htmlFor={`mcq-${opt.id}`} className="text-gray-700">
                            {opt.option_text}
                        </Label>
                    </div>
                ))
                }
            </RadioGroup>
    )

}