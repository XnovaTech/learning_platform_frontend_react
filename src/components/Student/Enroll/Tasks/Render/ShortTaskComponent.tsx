import { Input } from "@/components/ui/input";
import type { LessonTaskType } from "@/types/task";

interface ShortTaskComponentProps {
    task: LessonTaskType;
    onAnswer: any;
}

export default function ShortTaskComponent({task, onAnswer}: ShortTaskComponentProps) {
    return (
        <Input
            type="text"
            placeholder="Type your answer here"
            onChange={e => onAnswer(task.id, e.target.value)}
        />
    )
}