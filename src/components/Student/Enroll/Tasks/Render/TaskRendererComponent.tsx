import McqTaskComponent from "./McqTaskComponent";
import TfTaskComponent from "./TfTaskComponent";
import ShortTaskComponent from "./ShortTaskComponent";
import LongTaskComponent from "./LongTaskComponent";
import FillBlankTaskComponent from "./FillBlankTaskComponent";
import DragDropTaskComponent from "./DragDropTaskComponent";
import MatchingTaskComponent from "./MatchingTaskComponent";
import ParagraphDragTaskComponent from "./ParagraphDragTaskComponent";
import type { CourseExamType, LessonTaskType } from "@/types/task";

interface TaskRendererComponentProps {
    task: LessonTaskType | CourseExamType;
    onAnswer?: any;
    value?: any;
    readonly?: boolean;
    onScoreChange?: (taskId: number, score: number) => void;
    score?: number
}

export default function TaskRendererComponent({task, onAnswer, value, readonly = false, onScoreChange, score}: TaskRendererComponentProps) {
    switch (task.task_type) {
        case 'mcq':
            return <McqTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} />;
        case 'true_false':
            return <TfTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly}/>;
        case 'short':
            return <ShortTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score}/>;
        case 'long':
            return <LongTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score}/>;
        case 'fill_blank':
            return <FillBlankTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly}/>;
        case 'drag_drop':
            return <DragDropTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly}/>;
        case 'matching':
            return <MatchingTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly}/>;
        case 'paragraph_drag':
            return <ParagraphDragTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly}/>;
            default:
            return <div>Unsupported task type</div>;
    }
}

