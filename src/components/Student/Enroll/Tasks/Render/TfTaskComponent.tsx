import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { LessonTaskType } from "@/types/task";

interface TfTaskComponentProps {
    task: LessonTaskType;
    onAnswer: any;
}

export default function TfTaskComponent({task, onAnswer}: TfTaskComponentProps) {
    return (
        <RadioGroup
            onValueChange={v => onAnswer(task.id, v)}
            className="space-y-3 flex flex-row">
                <div className="flex space-x-3 items-center">
                    <RadioGroupItem value="true" id={`true-${task.id}`} />
                    <Label htmlFor={`true-${task.id}`} className="text-gray-700">
                        True
                    </Label>
                </div>

                <div className="flex space-x-3 items-center">
                    <RadioGroupItem value="false" id={`false-${task.id}`} />
                    <Label htmlFor={`false-${task.id}`} className="text-gray-700">
                        False
                    </Label>
                </div>
        </RadioGroup>
    )
}