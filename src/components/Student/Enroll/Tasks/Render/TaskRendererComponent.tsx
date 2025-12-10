import McqTaskComponent from "./McqTaskComponent";
import TfTaskComponent from "./TfTaskComponent";
import ShortTaskComponent from "./ShortTaskComponent";
import LongTaskComponent from "./LongTaskComponent";
import FillBlankTaskComponent from "./FillBlankTaskComponent";
import DragDropTaskComponent from "./DragDropTaskComponent";
import MatchingTaskComponent from "./MatchingTaskComponent";
import type { LessonTaskType } from "@/types/task";

interface TaskRendererComponentProps {
    task: LessonTaskType;
    onAnswer: any;
}

export default function TaskRendererComponent({task, onAnswer}: TaskRendererComponentProps) {
    switch (task.task_type) {
        case 'mcq':
            return <McqTaskComponent task={task} onAnswer={onAnswer} />;
        case 'true_false':
            return <TfTaskComponent task={task} onAnswer={onAnswer} />;
        case 'short':
            return <ShortTaskComponent task={task} onAnswer={onAnswer} />;
        case 'long':
            return <LongTaskComponent task={task} onAnswer={onAnswer} />;
        case 'fill_blank':
            return <FillBlankTaskComponent task={task} onAnswer={onAnswer} />;
        case 'drag_drop':
            return <DragDropTaskComponent task={task} onAnswer={onAnswer} />;
        case 'matching':
            return <MatchingTaskComponent task={task} onAnswer={onAnswer} />;
        default:
            return <div>Unsupported task type</div>;
    }
}

