import { memo } from 'react';
import TaskRendererComponent from '@/components/Student/Enroll/Tasks/Render/TaskRendererComponent';
import { TASK_TITLE } from '@/mocks/tasks';
import type { TaskType } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface QuestionItemProps {
  question: any;
  index: number;
  isAnswered: boolean;
  handleAnswer: (taskId: number, value: any) => void;
  answers: Record<number, any>;
}

export const QuestionItem = memo(function QuestionItem({ question, index, isAnswered, handleAnswer, answers }: QuestionItemProps) {
  const isChoiceQuestion = question.task_type === 'mcq' || question.task_type === 'true_false';

  return (
    <Card key={question.id} className="p-2">
      <CardContent className="p-0 mb-1">
        {isChoiceQuestion ? (
          <div className="bg-white p-5 flex flex-col md:flex-row h-auto md:h-80 hover rounded-xl">
            <div className="flex-1 pr-4 flex flex-col mb-4 md:mb-0">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center font-bold text-sm mt-0.5">{index + 1}.</div>
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">{TASK_TITLE[question.task_type as TaskType]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold">{question.points} pts</span>
                  {isAnswered && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Answered
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-100 p-3 rounded-lg">
                <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: question.question || '' }} />
              </div>
            </div>

            <div className="md:pl-6 flex flex-col min-w-[220px] shrink-0">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Choose your answer</h4>
              <div className="flex-1 overflow-y-auto bg-slate-100 p-3 my-auto justify-center rounded-lg">
                <TaskRendererComponent task={question} onAnswer={handleAnswer} value={answers[question.id]} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-100 shadow-sm rounded-xl px-4 flex items-center justify-between py-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">{TASK_TITLE[question.task_type as TaskType]}</span>

              <div className="flex items-center gap-2 justify-end">
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold">{question.points} pts</span>
                {isAnswered && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Answered
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 flex min-w-0">
              {question.task_type !== 'paragraph_drag' ? (
                <div className="max-h-80 flex overflow-y-auto px-4 pt-4 bg-slate-100/20 rounded-2xl">
                  <div className="w-6 h-6 flex items-center justify-center font-bold text-sm mt-0.5">{index + 1}.</div>
                  <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: question.question || '' }} />
                </div>
              ) : (
                <p>Choose the correct answers</p>
              )}
            </div>

            <div className="p-5 bg-white">
              <TaskRendererComponent task={question} onAnswer={handleAnswer} value={answers[question.id]} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});
