import McqTaskComponent from './McqTaskComponent';
import TfTaskComponent from './TfTaskComponent';
import ShortTaskComponent from './ShortTaskComponent';
import LongTaskComponent from './LongTaskComponent';
import FillBlankTaskComponent from './FillBlankTaskComponent';
import DragDropTaskComponent from './DragDropTaskComponent';
import MatchingTaskComponent from './MatchingTaskComponent';
import ParagraphDragTaskComponent from './ParagraphDragTaskComponent';
import TableDragTaskComponent from './TableDragTaskComponent';
import CharacterWebTaskComponent from './CharacterWebTaskComponent';
import type {  LessonTaskType } from '@/types/task';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';

interface TaskRendererComponentProps {
  task: LessonTaskType | ClassExamQuestionType;
  onAnswer?: any;
  value?: any;
  readonly?: boolean;
  onScoreChange?: (taskId: number, score: number) => void;
  score?: number;
  isTeacher?: boolean;
  enrollId?: number;
}

export default function TaskRendererComponent({ task, onAnswer, value, readonly = false, onScoreChange, score, isTeacher = false, enrollId }: TaskRendererComponentProps) {

  switch (task.task_type) {
    case 'mcq':
      return <McqTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} />;
    case 'true_false':
      return <TfTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} />;
    case 'short':
      return <ShortTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} />;
    case 'long':
      return <LongTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} isTeacher={isTeacher} enrollId={enrollId} />;
    case 'fill_blank':
      return <FillBlankTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} />;
    case 'drag_drop':
      return <DragDropTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} />;
    case 'matching':
      return <MatchingTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} />;
    case 'paragraph_drag':
      return <ParagraphDragTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} />;
    case 'table_drag':
      return <TableDragTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly} onScoreChange={onScoreChange} score={score} />;
    case 'character_web':
      return <CharacterWebTaskComponent task={task} onAnswer={onAnswer} value={value} readonly={readonly}  onScoreChange={onScoreChange} score={score} />;
    default:
      return <div>Unsupported task type</div>;
  }
}
