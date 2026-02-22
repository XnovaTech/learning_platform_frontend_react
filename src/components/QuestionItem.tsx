import { memo, useMemo } from 'react';
import TaskRendererComponent from '@/components/Student/Enroll/Tasks/Render/TaskRendererComponent';
import { TASK_TITLE } from '@/mocks/tasks';
import type { TaskType } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const BadgeInfo = memo(({ points, isAnswered, type }: { points: number; isAnswered: boolean; type?: string }) => (
  <div className="bg-slate-100 shadow-sm rounded-xl px-4 flex items-center justify-between py-2">
    <div className="flex gap-2">{type && <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">{TASK_TITLE[type as TaskType]}</span>}</div>
    <div className="flex items-center gap-2">
      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-medium">{points} pts</span>
      {isAnswered && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Answered
        </span>
      )}
    </div>
  </div>
));

const QuestionText = memo(({ html }: { html: string }) => <div className="prose prose-slate max-w-none text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: html || '' }} />);

const ChoiceContent = memo(({ question, isAnswered, isParagraphBased }: any) => (
  <div className="flex flex-col h-full space-y-3">
    <BadgeInfo points={question.points} isAnswered={isAnswered} />
    <div className={`flex-1 overflow-y-auto ${isParagraphBased ? 'bg-white' : 'bg-slate-100'} ${isParagraphBased ? 'p-2' : 'p-4'} rounded-lg`}>
      <QuestionText html={question.question} />
    </div>
  </div>
));

const ChoiceActions = memo(({ question, handleAnswer, currentAnswer, isParagraphBased }: any) => (
  <div className="flex flex-col h-full">
    {!isParagraphBased && <h4 className="text-sm font-medium text-slate-700 mb-3">Choose your answer</h4>}
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 rounded-lg flex items-center justify-center">
      <TaskRendererComponent task={question} onAnswer={handleAnswer} value={currentAnswer} />
    </div>
  </div>
));

interface QuestionItemProps {
  question: any;
  index: number;
  isAnswered: boolean;
  handleAnswer: (taskId: number, value: any) => void;
  answers: Record<number, any>;
}

export const QuestionItem = memo(function QuestionItem({ question, isAnswered, handleAnswer, answers }: QuestionItemProps) {
  const isChoiceQuestion = question.task_type === 'mcq' || question.task_type === 'true_false';
  const isParagraphBased = question.paragraph_id != null;
  const currentAnswer = useMemo(() => answers[question.id], [answers, question.id]);

  return (
    <Card className="p-2 overflow-hidden">
      <CardContent className="p-0">
        {isChoiceQuestion ? (
          <div className="w-full">
            {isParagraphBased ? (
              <div className="flex flex-col space-y-4 p-3">
                <ChoiceContent question={question} isAnswered={isAnswered} isParagraphBased={isParagraphBased} />
                <ChoiceActions question={question} handleAnswer={handleAnswer} currentAnswer={currentAnswer} isParagraphBased={isParagraphBased} />
              </div>
            ) : (
              <>
                {/* mobile view */}
                <div className="flex flex-col space-y-4 p-3 md:hidden">
                  <ChoiceContent question={question} isAnswered={isAnswered} isParagraphBased={isParagraphBased} />
                  <ChoiceActions question={question} handleAnswer={handleAnswer} currentAnswer={currentAnswer} isParagraphBased={isParagraphBased} />
                </div>

                {/* desktop view */}
                <div className="hidden md:block">
                  <ResizablePanelGroup orientation="horizontal" className="min-h-[300px] p-3 gap-1">
                    <ResizablePanel defaultSize={60} minSize={30}>
                      <div className="pr-2 h-full">
                        <ChoiceContent question={question} isAnswered={isAnswered} isParagraphBased={isParagraphBased} />
                      </div>
                    </ResizablePanel>

                    <ResizablePanel defaultSize={40} minSize={30}>
                      <div className="pl-4 h-full">
                        <ChoiceActions question={question} handleAnswer={handleAnswer} currentAnswer={currentAnswer} isParagraphBased={isParagraphBased} />
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <BadgeInfo points={question.points} isAnswered={isAnswered} type={!isParagraphBased ? question.task_type : undefined} />

            <div className="px-4">
              {question.task_type === 'paragraph_drag' ? (
                <p className="text-slate-600 font-medium italic">Choose the correct answers</p>
              ) : (
                <div className="max-h-80 overflow-y-auto py-2">
                  <QuestionText html={question.question} />
                </div>
              )}
            </div>

            <div className="p-4 pt-0">
              <TaskRendererComponent task={question} onAnswer={handleAnswer} value={currentAnswer} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
