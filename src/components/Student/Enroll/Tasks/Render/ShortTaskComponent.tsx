import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LessonTaskType } from "@/types/task";

interface ShortTaskComponentProps {
    task: LessonTaskType;
    onAnswer: (taskId: number, value: any) => void;
    value?: string;
    readonly?: boolean;
    score?: number;
    onScoreChange?: (taskId: number, score: number) => void;
}

export default function ShortTaskComponent({
    task, 
    onAnswer,
    value = "",
    readonly = false,
    score,
    onScoreChange}: ShortTaskComponentProps) {
    return (
        <div className=" space-y-2">
            <Label>Student Answer:</Label>
            <Input
            type="text"
            value={value}
            placeholder="Type your answer here"
            onChange={e => !readonly && onAnswer(task.id, e.target.value)}
            disabled = {readonly}
        />
        {
            readonly && onScoreChange && (
                <div className="mt-2">
                    <Label>Score:</Label>
                    <Input
                        type="number"
                        value={score ?? 0}
                        onChange={e => onScoreChange(task.id, Number(e.target.value))}
                        className="w-24"
                    />
                </div>
            )
        }
        </div>
        
    )
}