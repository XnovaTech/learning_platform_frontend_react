import { Button } from '@/components/ui/button';
import { ArrowBigRight, ArrowBigLeft, BadgeCheck, Save, BookOpen } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import type { ClassRoomExamType } from '@/types/classexam';
import { useState, useEffect, useRef, memo } from 'react';
import { toast } from 'sonner';
import type { ClassExamSectionType } from '@/types/courseexamsection';
import ExamTimer from './ExamTimer';
import ExamStartScreen from './ExamStartScreen';
import { useTimerActions, useTimerState } from '@/context/TimerContext';
import { QuestionItem } from '../QuestionItem';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SubmitExamAnswers } from '@/services/studentExamAnswerListService';
import { StartExam } from '@/services/studentExamAnswerService';
import { ParagraphHighlighter } from './ParagraphHighlighter';

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

interface ExamNavigationProps {
  currentSectionIndex: number;
  sections: ClassExamSectionType[];
  answers: Record<number, any>;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: (force?: boolean) => void;
  saveDraft: (isDraft?: boolean) => void;
  submitMutation: any;
}

const ExamNavigation = memo(function ExamNavigation({ currentSectionIndex, sections, answers, handleNext, handlePrevious, handleSubmit, saveDraft, submitMutation }: ExamNavigationProps) {
  const { isExamExpired, expiredSections } = useTimerState();
  const isLastSection = currentSectionIndex === sections.length - 1;
  const isDisabled = isExamExpired || submitMutation.isPending;
  const isPreviousSectionExpired = currentSectionIndex > 0 && expiredSections.includes(currentSectionIndex - 1);
  return (
    <div className="mt-6 flex items-center justify-between py-4">
      <Button onClick={handlePrevious} disabled={currentSectionIndex === 0 || isDisabled || isPreviousSectionExpired} className="flex rounded-lg px-5 md:py-5 items-center gap-2">
        <ArrowBigLeft className="size-5" />
        Previous
      </Button>

      {isLastSection ? (
        <div className="flex items-center gap-2">
          <Button variant={'red'} onClick={() => saveDraft(true)} className="rounded-lg py-5" disabled={Object.keys(answers).length === 0 || isDisabled}>
            <Save className="size-4" />
            Save Draft
          </Button>

          <Button className="rounded-lg py-5" onClick={() => handleSubmit(false)} disabled={isDisabled}>
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
        <Button onClick={handleNext} className="flex px-5 md:py-5 rounded-lg items-center gap-2" disabled={isDisabled}>
          Next
          <ArrowBigRight className="size-5" />
        </Button>
      )}
    </div>
  );
});

export default function ExamAnswerList({ sections, answers, handleAnswer, enrollId, data, totalQuestions, totalPossibleScore, refetch }: ExamAnswerListProps) {
  const submitRef = useRef<(force?: boolean) => void>(() => {});
  const submitOnceRef = useRef(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const currentSection = sections[currentSectionIndex];
  const hasResumedRef = useRef(false);
  const draftLoaded = useRef(false);
  const currentSectionExams = currentSection?.questions || [];
  const draftKey = `exam-draft-${enrollId}`;
  const { startTimer, resetSectionTimer, clearTimerData } = useTimerActions();
  const startExamTimer = (sectionIndex: number) => {
    startTimer({
      totalExamDuration: data?.exam?.total_duration || 0,
      sections: sections.map((s) => ({ id: s.id, duration: s.duration })),
      currentSectionIndex: sectionIndex,
      enrollId,
      examType: data?.exam_type || '',
      onSectionTimeExpired: () => {
        setCurrentSectionIndex((i) => i + 1);
      },
      onExamTimeExpired: () => {
        submitRef.current(true);
      },
    });
  };

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
    const timerKey = `exam-timer-${enrollId}-${data?.exam_type}`;
    const savedTimer = localStorage.getItem(timerKey);
    if (!savedTimer) return;

    try {
      const parsed = JSON.parse(savedTimer);
      const savedSectionIndex = parsed.currentSectionIndex ?? 0;

      setCurrentSectionIndex(savedSectionIndex);
      setIsExamStarted(true);
      hasResumedRef.current = true;

      startExamTimer(savedSectionIndex);
    } catch {
      console.error('Invalid timer state');
    }
  }, [enrollId, data?.exam_type]);

  const saveDraft = (isDraft = false) => {
    if (enrollId && Object.keys(answers).length > 0) {
      localStorage.setItem(draftKey, JSON.stringify(answers));
      if (isDraft) toast.success('Draft saved successfully');
    } else {
      if (isDraft) toast.error('No answers to save');
    }
  };

  const startExamMutation = useMutation({
    mutationFn: StartExam,
    onSuccess: async ({ data }) => {
      toast.success('Exam started! Timer is now running.');
      localStorage.setItem(`exam-record-id-${enrollId}`, data.id);
      setIsExamStarted(true);
      startExamTimer(currentSectionIndex);
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to start exam!');
    },
  });

  const submitMutation = useMutation({
    mutationFn: SubmitExamAnswers,
    onSuccess: async () => {
      toast.success('Exam Submitted Successfully');
      localStorage.removeItem(draftKey);
      clearTimerData();
      refetch();
    },
    onError: (e: any) => {
      submitOnceRef.current = false;
      toast.error(e?.message || 'Failed to submit exam!');
    },
  });

  const handleSubmit = (force = false) => {
    if (submitOnceRef.current) return;
    const answerId = localStorage.getItem(`exam-record-id-${enrollId}`);

    if (!force && Object.keys(answers).length === 0) {
      toast.error('Please answer at least one question');
      return;
    }

    submitOnceRef.current = true;

    const transformedAnswers = Object.entries(answers).map(([question_id, answer]) => ({
      question_id: Number(question_id),
      answer,
    }));

    submitMutation.mutate({
      exam_answer_id: Number(answerId),
      answers: transformedAnswers,
    });

    localStorage.removeItem(`exam-record-id-${enrollId}`);
  };

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
    saveDraft();
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(sections[currentSectionIndex - 1]?.questions.length - 1 || 0);
    }
  };

  // Question-level navigation handlers
  const handleQuestionNext = () => {
    const totalQuestionsInSection = currentSectionExams.length;
    if (currentQuestionIndex < totalQuestionsInSection - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      // Move to next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleQuestionPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Move to previous section
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(sections[currentSectionIndex - 1]?.questions.length - 1 || 0);
    }
  };

  const handleStartExam = () => {
    startExamMutation.mutate({
      enroll_id: Number(enrollId),
      exam_id: Number(data?.exam?.id),
    });
  };

  // rest section timer when section changes
  useEffect(() => {
    if (!isExamStarted || sections.length === 0) return;

    if (hasResumedRef.current) {
      hasResumedRef.current = false;
      return;
    }

    resetSectionTimer(currentSectionIndex, sections);
  }, [currentSectionIndex, isExamStarted, resetSectionTimer, sections]);

  const currentSectionAnswered = currentSectionExams.filter((exam) => answers.hasOwnProperty(exam.id)).length;

  return (
    <div className="">
      {!isExamStarted && <ExamStartScreen data={data} totalQuestions={totalQuestions} totalPossibleScore={totalPossibleScore} sections={sections} onStartExam={handleStartExam} />}

      {isExamStarted && sections && sections.length > 0 && (
        <div className="space-y-5">
          <ExamTimer currentSectionName={currentSection?.section_name || ''} />

          {/* Overview */}
          <div className="rounded-2xl bg-white shadow-md border border-slate-200 overflow-hidden">
            <div className="px-2 py-4 space-y-2">
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
          <div className="space-y-6">
            {(() => {
              // Group questions by paragraph_id
              const questionsWithParagraph = currentSectionExams.filter((q) => q.paragraph_id);
              const questionsWithoutParagraph = currentSectionExams.filter((q) => !q.paragraph_id);
              const paragraphGroups = questionsWithParagraph.reduce(
                (acc, question) => {
                  const paragraphId = question.paragraph_id!;
                  if (!acc[paragraphId]) {
                    acc[paragraphId] = [];
                  }
                  acc[paragraphId].push(question);
                  return acc;
                },
                {} as Record<number, any[]>,
              );

              return (
                <>
                  {/* Paragraph-based questions */}
                  {Object.entries(paragraphGroups).map(([paragraphId, questions]) => {
                    const paragraph = questions[0]?.paragraph;
                    const currentQuestion = questions[currentQuestionIndex];

                    return (
                      <section key={paragraphId} className="rounded-2xl border bg-white p-5 shadow-sm">
                        {/* Header */}
                        <header className="mb-6 flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-slate-800">Paragraph-based Questions</h3>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">
                                Question {currentQuestionIndex + 1} of {questions.length}
                              </span>
                            </div>
                          </div>
                        </header>

                        <ResizablePanelGroup orientation="horizontal" className="h-[650px] max-h-[650px] w-full overflow-hidden rounded-xl border">
                          <ResizablePanel defaultSize={60}>
                            <div className="flex h-full flex-col overflow-hidden bg-light p-4 ring-1 ring-slate-200">
                              <ParagraphHighlighter key={`${paragraphId}-${submitMutation.isSuccess}`} content={paragraph?.content || ''} />
                            </div>
                          </ResizablePanel>

                          <ResizablePanel defaultSize={40}>
                            <div className="flex h-full flex-col overflow-hidden bg-pastel/20 p-4 ring-1 ring-slate-200">
                              <div className="flex-1 overflow-y-auto pr-1">
                                {currentQuestion && (
                                  <QuestionItem
                                    question={currentQuestion}
                                    index={currentQuestionIndex}
                                    isAnswered={answers.hasOwnProperty(currentQuestion.id)}
                                    handleAnswer={handleAnswer}
                                    answers={answers}
                                  />
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-5">
                                <Button size="sm" onClick={handleQuestionPrevious} disabled={currentQuestionIndex === 0} className="flex rounded-lg px-4 md:py-4 items-center gap-2">
                                  <ArrowBigLeft className="size-4" />
                                  Previous
                                </Button>

                                <Button size="sm" onClick={handleQuestionNext} disabled={currentQuestionIndex === questions.length - 1} className="flex rounded-lg px-4 md:py-4 items-center gap-2">
                                  Next
                                  <ArrowBigRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </ResizablePanel>
                        </ResizablePanelGroup>
                      </section>
                    );
                  })}

                  {/* Regular questions  */}
                  {questionsWithoutParagraph.length > 0 && (
                    <div className="space-y-4">
                      {questionsWithoutParagraph.map((exam, index) => {
                        const isAnswered = answers.hasOwnProperty(exam.id);
                        return <QuestionItem key={exam.id} question={exam} index={index} isAnswered={isAnswered} handleAnswer={handleAnswer} answers={answers} />;
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <ExamNavigation
            currentSectionIndex={currentSectionIndex}
            sections={sections}
            answers={answers}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleSubmit={handleSubmit}
            saveDraft={saveDraft}
            submitMutation={submitMutation}
          />
        </div>
      )}
    </div>
  );
}
