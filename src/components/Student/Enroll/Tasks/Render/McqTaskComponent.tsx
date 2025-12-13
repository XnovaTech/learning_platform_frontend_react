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
            className=" flex flex-wrap gap-4">
                {task?.options?.map(opt => (
                    <Label
                        key={opt.id}
                        htmlFor={`mcq-${opt.id}`}
                        className="
                        flex items-center space-x-3 p-3 border rounded-xl
                        cursor-pointer transition-all duration-200 hover:bg-gray-100">
                            <RadioGroupItem
                            value={opt.id.toString()}
                            id={`mcq-${opt.id}`} />
                            <span className="text-gray-700">{opt.option_text}</span>
                    </Label>
                
                ))
                }
            </RadioGroup>
    )

}