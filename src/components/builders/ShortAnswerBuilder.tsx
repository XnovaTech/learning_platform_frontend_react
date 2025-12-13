import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
    initial?: {question?: string; correct_answer?: string};
    onChange: (data: { question: string; correct_answer: string }) => void;
}

export default function ShortAnswerBuilder({initial, onChange}: Props) {
    const [question, setQuestion] = useState(initial?.question ?? "");
    const [answer, setAnswer] = useState(initial?.correct_answer ?? "");

    useEffect(() => {
        onChange({question, correct_answer: answer});
    }, [question, answer]);

    return (
        <div className="space-y-4">
            <div>
                <Label className="mb-2 font-medium">Question</Label>
                <Input 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter short answer question"/>
            </div>

            <div>
                <Label className=" mb-2 font-medium">Correct Answer</Label>
                <Input 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter correct answer"/>
            </div>
        </div>
    )
}