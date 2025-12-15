import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LessonTaskType, LongAnswerExtraData } from "@/types/task";
import { useEffect, useState } from "react";

interface LongTaskComponentProps {
    task: LessonTaskType;
    onAnswer: (taskId: number, value: any) => void;
    value?: string;
    readonly?: boolean;
    score?: number;
    onScoreChange?: (taskId: number, score: number) => void;
}

export default function LongTaskComponent({
    task, 
    onAnswer,
    value = "",
readonly = false,
    score,
onScoreChange}: LongTaskComponentProps) {
    const minWords = (task?.extra_data as LongAnswerExtraData)?.min_word_count || 50; 
    const [text, setText] = useState("");

    useEffect(() => {
        setText(value);
    }, [value]);

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-2">
            <Label>Student Answer:</Label>
            <Textarea
                className="min-h-[150px]"
                placeholder={`Write at lease ${minWords} words ...`}
                value={text}
                onChange={e => {
                    const val = e.target.value;
                    setText(val);
                    !readonly && onAnswer(task.id, val)
                }}    
            />

            <p className={`text-sm font-semibold text-end ${wordCount < minWords ? "text-red-500" : "text-green-600"}`}>
                Word Count: {wordCount} / {minWords}
            </p>

            {readonly && onScoreChange && (
                <div className="mt-2">
                    <Label>Score:</Label>
                    <input
                        type="number"
                        value={score ?? 0}
                        onChange={e => onScoreChange(task.id, Number(e.target.value))}
                        className="w-24 border rounded px-2 py-1"
                    />
                </div>
            )}
        </div>
    )

}