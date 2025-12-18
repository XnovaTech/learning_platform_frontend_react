import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

type FillBlankData = {
    correct_answer: string;
    extra_data?: {};
};

type Props = {
    initial?: FillBlankData | null;
    onChange: (data: FillBlankData) => void;
};

export default function FillBlankBuilder({ initial, onChange }: Props) {
    const [correctAnswer, setCorrectAnswer] = useState(initial?.correct_answer ?? "");

    // Send updated data to parent
    useEffect(() => {
        onChange({
            correct_answer: correctAnswer,
            extra_data: {}
        });
    }, [, correctAnswer]);



    return (
        <div className="space-y-4">


            {/* Correct Answer */}
            <div>
                <Label className=" font-medium mb-2">Correct Answer</Label>
                <Input
                    value={correctAnswer}
                    placeholder="Correct answer"
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                />
            </div>
        </div>
    );
}
