import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

type FillBlankData = {
    question: string;
    correct_answer: string;
    extra_data?: {};
};

type Props = {
    initial?: FillBlankData | null;
    onChange: (data: FillBlankData) => void;
};

export default function FillBlankBuilder({ initial, onChange }: Props) {
    const [question, setQuestion] = useState(initial?.question ?? "");
    const [correctAnswer, setCorrectAnswer] = useState(initial?.correct_answer ?? "");

    // Send updated data to parent
    useEffect(() => {
        onChange({
            question,
            correct_answer: correctAnswer,
            extra_data: {}
        });
    }, [question, correctAnswer]);

    // Preview with blank underline
    const preview = useMemo(() => {
        let html = question || "";
        html = html.replace(/__/g, "<u>______</u>");
        return html;
    }, [question]);

    return (
        <div className="space-y-4">
            {/* Question */}
            <div>
                <Label>Question (use __ for blank)</Label>
                <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    placeholder="Example: The capital of Myanmar is __."
                />

                <div className="mt-2">
                    <div className="font-medium">Preview</div>
                    <div
                        className="p-2 border rounded bg-white"
                        dangerouslySetInnerHTML={{ __html: preview }}
                    />
                </div>
            </div>

            {/* Correct Answer */}
            <div>
                <Label>Correct Answer</Label>
                <Input
                    value={correctAnswer}
                    placeholder="Correct answer"
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                />
            </div>
        </div>
    );
}
