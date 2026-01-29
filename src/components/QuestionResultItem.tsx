import type { StudentAnswer } from '@/types/answer';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import TaskRendererComponent from './Student/Enroll/Tasks/Render/TaskRendererComponent';
import type { LessonTaskType } from '@/types/task';

type Status = 'correct' | 'reviewing' | 'incorrect';

const STATUS_CONFIG: Record<
  Status,
  {
    border: string;
    badge: string;
    icon: React.ElementType;
    label: string;
    text: string;
  }
> = {
  correct: {
    border: 'border-l-green-500 bg-green-50/30',
    badge: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    label: 'Correct',
    text: 'text-green-600',
  },
  reviewing: {
    border: 'border-l-yellow-500 bg-yellow-50/30',
    badge: 'bg-yellow-100 text-yellow-700',
    icon: AlertCircle,
    label: 'Teacher is reviewing',
    text: 'text-yellow-600',
  },
  incorrect: {
    border: 'border-l-red-500 bg-red-50/30',
    badge: 'bg-red-100 text-red-700',
    icon: XCircle,
    label: 'Incorrect',
    text: 'text-red-600',
  },
};

interface QuestionResultItemProps {
  question: ClassExamQuestionType | LessonTaskType;
  index: number;
  answer?: StudentAnswer;
  status: Status;
  parsedAnswer: any;
  isTeacher: boolean;
  onScoreChange?: (taskId: number, score: number) => void;
  enrollId?: number;
  isParagraph?: boolean;
}

const StatusBadge = ({ status }: { status: Status }) => {
  const { icon: Icon, label, text } = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-5 h-5 ${text}`} />
      <span className={`text-sm font-semibold ${text}`}>{label}</span>
    </div>
  );
};

const ScoreBadge = ({ score, total, status }: { score: number; total: number; status: Status }) => (
  <div className={`px-4 py-2 rounded-lg text-xs font-semibold ${STATUS_CONFIG[status].badge}`}>
    {score} / {total} pts
  </div>
);

export const QuestionResultItem = ({ question, index, answer, status, parsedAnswer, isTeacher, onScoreChange, enrollId, isParagraph }: QuestionResultItemProps) => {
  const config = STATUS_CONFIG[status];
  const isChoiceQuestion = question.task_type === 'mcq' || question.task_type === 'true_false';

  return (
    <Card className={`p-3 transition-all hover:shadow-md border-l-4 ${config.border}`}>
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${config.badge}`}>{index + 1}</div>

        <div className="flex-1 space-y-3">
          <div className={`bg-white rounded-lg p-4 border border-slate-200 ${isChoiceQuestion && isParagraph == false ? 'flex flex-col lg:flex-row gap-3 overflowy-auto h-auto lg:max-h-78' : 'space-y-3'}`}>
            <div
              className={`prose prose-slate max-w-none text-base text-slate-800 ${isChoiceQuestion && isParagraph == false ? 'flex-1 overflow-y-auto p-2  bg-slate-100' : ''}`}
              dangerouslySetInnerHTML={{
                __html: question.question || '',
              }}
            />

            <div className={isChoiceQuestion ? 'w-full lg:max-w-[350px] p-3 shrink-0 flex items-center bg-slate-100' : ''}>
              <TaskRendererComponent
                task={question}
                value={parsedAnswer}
                readonly
                score={answer?.score}
                onScoreChange={isTeacher ? onScoreChange : undefined}
                isTeacher={isTeacher}
                enrollId={enrollId}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <StatusBadge status={status} />
            <ScoreBadge score={answer?.score || 0} total={question.points || 0} status={status} />
          </div>
        </div>
      </div>
    </Card>
  );
};
