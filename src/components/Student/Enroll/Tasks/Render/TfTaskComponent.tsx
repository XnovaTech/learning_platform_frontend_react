import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { LessonTaskType } from "@/types/task";

interface TfTaskComponentProps {
    task: LessonTaskType;
    onAnswer: any;
}

const dataList = [
    { value: 'true', label: 'True' },
    { value: 'false', label: 'False' },
]

export default function TfTaskComponent({task, onAnswer}: TfTaskComponentProps) {
    return (
        <RadioGroup
            onValueChange={v => onAnswer(task.id, v)}
            className="flex flex-wrap gap-4">
                {
                    dataList.map((data) => (
                        <Label 
                            key={data.value} 
                            htmlFor={`${data.value}-${task.id}`}
                            className="flex items-center space-x-3 p-3 border
                                rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100">
                            <RadioGroupItem 
                                value={data.value} 
                                id={`${data.value}-${task.id}`} />
                            <span className="text-gray-700">{data.label}</span>
                        </Label>
                    ))
                }
        
        </RadioGroup>
    )
}