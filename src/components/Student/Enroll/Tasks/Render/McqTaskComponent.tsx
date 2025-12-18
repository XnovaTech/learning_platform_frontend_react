import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { LessonTaskType } from "@/types/task";

interface McqTaskComponentProps {
    task: LessonTaskType;
    onAnswer: (taskId: number, value: any) => void;
    value?: string;
    readonly?: boolean;
}

export default function McqTaskComponent({task, onAnswer, value, readonly = false}: McqTaskComponentProps) {
    return (
        <RadioGroup
        value={value?.toString()}
            onValueChange={v => !readonly && onAnswer(task.id, v)}
            className=" flex flex-col flex-wrap gap-4">
                {task?.options?.map((opt, index) => (
                    <Label
                        key={opt.id}
                        htmlFor={`mcq-${opt.id}`}
                        className="
                        flex items-center space-x-3 p-3 border rounded-xl w-52
                        cursor-pointer transition-all duration-200 hover:bg-gray-100">
                            <RadioGroupItem
                            value={opt.id.toString()}
                            id={`mcq-${opt.id}`} 
                            disabled={readonly}/>
                            <span className="text-gray-700">{index + 1}. {opt.option_text}</span>
                    </Label>
                
                ))
                }
            </RadioGroup>
    )

}