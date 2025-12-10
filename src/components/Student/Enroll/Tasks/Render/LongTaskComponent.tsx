import { Textarea } from "@/components/ui/textarea";
import type { LessonTaskType, LongAnswerExtraData } from "@/types/task";
import { useState } from "react";

interface LongTaskComponentProps {
    task: LessonTaskType;
    onAnswer: any;
}

export default function LongTaskComponent({task, onAnswer}: LongTaskComponentProps) {
    const minWords = (task?.extra_data as LongAnswerExtraData)?.min_word_count || 50; 
    const [text, setText] = useState("");

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-2">
            <Textarea
                className="min-h-[150px]"
                placeholder={`Write at lease ${minWords} words ...`}
                onChange={e => {
                    setText(e.target.value);
                    onAnswer(task.id, e.target.value)
                }}    
            />

            <p className={`text-sm ${wordCount < minWords ? "text-red-500" : "text-green-600"}`}>
                Word Count: {wordCount} / {minWords}
            </p>
        </div>
    )

}