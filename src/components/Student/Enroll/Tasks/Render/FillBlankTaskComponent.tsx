import { Input } from "@/components/ui/input";
import type { LessonTaskType } from "@/types/task";

interface FillBlankTaskComponentProps {
    task: LessonTaskType;
    onAnswer: (taskId: number, value: any) => void;
    value?: string;
    readonly?: boolean;
}

export default function FillBlankTaskComponent({
    task, 
    onAnswer,
    value,
    readonly}: FillBlankTaskComponentProps) {
    return (
        <Input
            type="text"
            placeholder="Fill in the blank ..."
            value={value}
            onChange={e => !readonly && onAnswer(task.id, e.target.value)}
            disabled={readonly}
        />
    )
}
