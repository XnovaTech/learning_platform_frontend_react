import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpenCheck, CheckCircle2, ArrowBigRight, ArrowBigLeft, BadgeCheck, Save } from 'lucide-react';
import TaskRendererComponent from '@/components/Student/Enroll/Tasks/Render/TaskRendererComponent';
import { TASK_TITLE } from '@/mocks/tasks';
import type { TaskType } from '@/types/task';
import { useMutation } from '@tanstack/react-query';
import type { ClassRoomExamType } from '@/types/classexam';
import { useState, useEffect, useRef, memo } from 'react';
import { toast } from 'sonner';
import type { ClassExamSectionType } from '@/types/courseexamsection';
import ExamTimer from './ExamTimer';
import ExamStartScreen from './ExamStartScreen';
import { useTimer } from '@/context/TimerContext';
import { submitStudentExamAnswers } from '@/services/studentExamAnswerService';

interface ExamAnswerListProps {
  sections: ClassExamSectionType[];
  answers: Record<number, any>;
  handleAnswer: (taskId: number, value: any) => void;
  enrollId: string | undefined;
  data: ClassRoomExamType | undefined;
  totalQuestions: number;
  totalPossibleScore: number;
  refetch: () => void;
}

interface QuestionItemProps {
  exam: any;
  index: number;
  isAnswered: boolean;
  handleAnswer: (taskId: number, value: any) => void;
  answers: Record<number, any>;
}

const QuestionItem = memo(({ exam, index, isAnswered, handleAnswer, answers }: QuestionItemProps) => (
  <Card key={exam.id} className="p-2">
    <CardContent className="p-0 mb-1">
      {exam.task_type === 'mcq' || exam.task_type === 'true_false' ? (
        <div className="bg-white p-5 flex flex-col md:flex-row h-auto md:h-80 hover rounded-xl">
          <div className="flex-1 pr-4 flex flex-col mb-4 md:mb-0">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center font-bold text-sm mt-0.5">{index + 1}.</div>
                <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">{TASK_TITLE[exam.task_type as TaskType]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold">{exam.points} pts</span>
                {isAnswered && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Answered
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-100 p-3 rounded-lg">
              <div
                className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800"
                dangerouslySetInnerHTML={{
                  __html: exam.question || '',
                }}
              />
            </div>
          </div>

          <div className="md:pl-6 flex flex-col min-w-[220px] shrink-0">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Choose your answer</h4>
            <div className="flex-1 overflow-y-auto bg-slate-100 p-3 my-auto justify-center rounded-lg">
              <TaskRendererComponent task={exam} onAnswer={handleAnswer} value={answers[exam.id]} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-slate-100 shadow-sm rounded-xl px-4 flex items-center justify-between py-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">{TASK_TITLE[exam.task_type as TaskType]}</span>

            <div className="flex items-center gap-2 justify-end">
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold">{exam.points} pts</span>

              {isAnswered && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                  <CheckCircle2 className="size-3" />
                  Answered
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 flex min-w-0">
            {exam.task_type !== 'paragraph_drag' ? (
              <div className="max-h-80 flex overflow-y-auto px-4 pt-4 bg-slate-100/20 rounded-2xl">
                <div className="w-6 h-6 flex items-center justify-center font-bold text-sm mt-0.5">{index + 1} .</div>

                <div
                  className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: exam.question || '',
                  }}
                />
              </div>
            ) : (
              <p>Choose the correct answers</p>
            )}
          </div>
          <div className="p-5 bg-white">
            <TaskRendererComponent task={exam} onAnswer={handleAnswer} value={answers[exam.id]} />
          </div>
        </>
      )}
    </CardContent>
  </Card>
));

export default function ExamAnswerList({ sections, answers, handleAnswer, enrollId, data, totalQuestions, totalPossibleScore, refetch }: ExamAnswerListProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const currentSection = sections[currentSectionIndex];
  const hasResumedRef = useRef(false);
  const draftLoaded = useRef(false);
  const currentSectionExams = currentSection?.questions || [];
  const draftKey = `exam-draft-${enrollId}`;

  const { timerState, startTimer, resetSectionTimer, clearTimerData } = useTimer();
  const { isExamExpired, isSectionExpired } = timerState;

  useEffect(() => {
    if (enrollId && !draftLoaded.current) {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsedAnswers = JSON.parse(savedDraft);
          Object.entries(parsedAnswers).forEach(([taskId, value]) => {
            handleAnswer(Number(taskId), value);
          });
          toast.info('Draft loaded successfully');
        } catch (err: any) {
          toast.error('Failed to load draft');
        }
      }
      draftLoaded.current = true;
    }
  }, [enrollId, handleAnswer, draftKey]);

  useEffect(() => {

    // if exam was already started, resume the timer
    const timerKey = `exam-timer-${enrollId}-${data?.exam_type}`;
    const savedTimer = localStorage.getItem(timerKey);
    if (savedTimer) {
      try {
        const parsed = JSON.parse(savedTimer);
        const savedSectionIndex = parsed.currentSectionIndex ?? 0;

        setCurrentSectionIndex(savedSectionIndex);
        setIsExamStarted(true);
        hasResumedRef.current = true;

          startTimer({
            totalExamDuration: data?.exam?.total_duration || 0,
            sections: sections.map((s) => ({ id: s.id, duration: s.duration })),
            currentSectionIndex: savedSectionIndex,
            enrollId,
            examType: data?.exam_type || '',
            onSectionTimeExpired: () => {
              if (savedSectionIndex < sections.length - 1) {
                handleNext();
              } else {
                handleSubmit();
              }
            },
            onExamTimeExpired: handleSubmit,
          });
      } catch {
        console.error('Invalid timer state');
      }
    }
  }, [enrollId, data?.exam_type, data?.exam?.total_duration, sections, startTimer]);

  const saveDraft = (isDraft = false) => {
    if (enrollId && Object.keys(answers).length > 0) {
      localStorage.setItem(draftKey, JSON.stringify(answers));
      if (isDraft) toast.success('Draft saved successfully');
    } else {
      if (isDraft) toast.error('No answers to save');
    }
  };

  const submitMutation = useMutation({
    mutationFn: submitStudentExamAnswers,
    onSuccess: async () => {
      toast.success('Exam Submitted Successfully');
      localStorage.removeItem(draftKey);
      clearTimerData();
      refetch();
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to submit exam!');
    },
  });

  const handleSubmit = () => {
    if (isExamExpired || Object.keys(answers).length === 0) {
      toast.error('Please answer at least one question');
      return;
    }

    const transformedAnswers = Object.entries(answers).map(([question_id, answer]) => ({
      question_id: Number(question_id),
      answer,
    }));

    submitMutation.mutate({
      enroll_id: Number(enrollId),
      exam_id: Number(data?.exam?.id),
      answers: transformedAnswers,
    });
  };

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleStartExam = () => {
    setIsExamStarted(true);
    startTimer({
      totalExamDuration: data?.exam?.total_duration || 0,
      sections: sections.map((s) => ({ id: s.id, duration: s.duration })),
      currentSectionIndex,
      enrollId,
      examType: data?.exam_type || '',
      onSectionTimeExpired: () => {
        if (currentSectionIndex < sections.length - 1) {
          handleNext();
        } else {
          handleSubmit();
        }
      },
      onExamTimeExpired: () => {
        handleSubmit();
      },
    });
    toast.success('Exam started! Timer is now running.');
  };

  //  rest section timer when section changes
  useEffect(() => {
    if (!isExamStarted || sections.length === 0) return;

    if (hasResumedRef.current) {
      hasResumedRef.current = false;
      return;
    }

    resetSectionTimer(currentSectionIndex, sections);
  }, [currentSectionIndex, isExamStarted, resetSectionTimer, sections]);

  const isLastSection = currentSectionIndex === sections.length - 1;
  const currentSectionAnswered = currentSectionExams.filter((exam) => answers.hasOwnProperty(exam.id)).length;
  //disable when exam timeout
  const isDisabled = isExamExpired || submitMutation.isPending;

  return (
    <div className="">
      {/* Start Exam Screen */}
      {!isExamStarted && <ExamStartScreen data={data} totalQuestions={totalQuestions} totalPossibleScore={totalPossibleScore} sections={sections} onStartExam={handleStartExam} />}

      {isExamStarted && sections && sections.length > 0 && (
        <div className="space-y-5">
          <ExamTimer currentSectionName={currentSection?.section_name || ''} />

          {/* Overview */}
          <div className="rounded-2xl bg-white shadow-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Section {currentSectionIndex + 1} of {sections.length}
                </span>
                <span className="font-semibold text-primary">{Math.round(((currentSectionIndex + 1) / sections.length) * 100)}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${((currentSectionIndex + 1) / sections.length) * 100}%`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-500">
                {currentSectionAnswered} / {currentSectionExams.length} answered in this section
              </p>
            </div>
          </div>

          {/* Section  */}
          <div className="relative rounded-xl bg-slate-50 border border-slate-200 shadow shadow-primary/10 px-6 py-3">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-l-xl" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">{currentSectionIndex + 1}</div>
                <div>
                  <h2 className="text-md font-semibold text-slate-900">
                    {currentSection?.section_name} {currentSection?.title}
                  </h2>
                  <p className="text-sm text-slate-500">{currentSection?.duration} Minutes</p>
                </div>
              </div>

              {currentSectionExams.length > 1 && <p className="text-sm text-slate-500 font-medium text-right">{currentSectionExams.length} Questions</p>}
            </div>
          </div>

          {/* Questions  */}
          <div className="space-y-4">
            {currentSectionExams.map((exam, index) => {
              const isAnswered = answers.hasOwnProperty(exam.id);

              return <QuestionItem key={exam.id} exam={exam} index={index} isAnswered={isAnswered} handleAnswer={handleAnswer} answers={answers} />;
            })}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between py-4">
            <Button onClick={handlePrevious} disabled={currentSectionIndex === 0 || isDisabled} className="flex rounded-lg px-5 md:py-5 items-center gap-2">
              <ArrowBigLeft className="size-5" />
              Previous
            </Button>

            {isLastSection ? (
              <div className="flex items-center gap-2">
                <Button variant={'red'} onClick={() => saveDraft(true)} className="rounded-lg py-5" disabled={Object.keys(answers).length === 0 || isDisabled}>
                  <Save className="size-4" />
                  Save Draft
                </Button>

                <Button className="rounded-lg py-5" onClick={handleSubmit} disabled={isDisabled}>
                  {submitMutation.isPending ? (
                    'Submitting'
                  ) : (
                    <p className="flex items-center gap-2">
                      <BadgeCheck className="size-4" />
                      Submit
                    </p>
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={handleNext} className="flex px-5 md:py-5 rounded-lg items-center gap-2" disabled={isDisabled || isSectionExpired}>
                Next
                <ArrowBigRight className="size-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* No sections */}
      {(!sections || sections.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <BookOpenCheck className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-1">No exam questions available for this moment.</h4>
        </div>
      )}
    </div>
  );
}
