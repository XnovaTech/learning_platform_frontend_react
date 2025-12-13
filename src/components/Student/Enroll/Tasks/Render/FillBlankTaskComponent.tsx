import { Input } from "@/components/ui/input";
import type { LessonTaskType } from "@/types/task";

interface FillBlankTaskComponentProps {
    task: LessonTaskType;
    onAnswer: any;
}

export default function FillBlankTaskComponent({task, onAnswer}: FillBlankTaskComponentProps) {
    return (
        <Input
            type="text"
            placeholder="Fill in the blank ..."
            onChange={e => onAnswer(task.id, e.target.value)}
        />
    )
}
