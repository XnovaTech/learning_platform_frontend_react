import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
    initial?: {correct_answer?: string};
    onChange: (data: { correct_answer: string }) => void;
}

export default function ShortAnswerBuilder({initial, onChange}: Props) {
    const [answer, setAnswer] = useState(initial?.correct_answer ?? "");

    useEffect(() => {
        onChange({correct_answer: answer});
    }, [answer]);

    return (
        <div className="space-y-4">

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