import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpenCheck, Clock, Award, CheckCircle2, ArrowBigRight, ArrowBigLeft, BadgeCheck, Save } from 'lucide-react';
import TaskRendererComponent from '@/components/Student/Enroll/Tasks/Render/TaskRendererComponent';
import { TASK_TITLE } from '@/mocks/tasks';
import type { TaskType, CourseExamType } from '@/types/task';
import { formatDate } from '@/utils/format';
import { useMutation } from '@tanstack/react-query';
import type { ClassRoomExamType } from '@/types/classexam';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { submitStudentCourseExams } from '@/services/studentCourseExamService';

interface ExamAnswerListProps {
  groupExams: Record<string, CourseExamType[]>;
  answers: Record<number, any>;
  handleAnswer: (taskId: number, value: any) => void;
  enrollId: string | undefined;
  data: ClassRoomExamType | undefined;
  totalQuestions: number;
  totalPossibleScore: number;
  refetch: () => void;
}

export default function ExamAnswerList({ groupExams, answers, handleAnswer, enrollId, data, totalQuestions, totalPossibleScore, refetch }: ExamAnswerListProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const sections = Object.keys(groupExams);
  const currentSection = sections[currentSectionIndex];
  const currentSectionExams = groupExams[currentSection] || [];

  const draftKey = `exam-draft-${enrollId}`;

  useEffect(() => {
    if (enrollId) {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsedAnswers = JSON.parse(savedDraft);
          Object.entries(parsedAnswers).forEach(([taskId, value]) => {
            handleAnswer(Number(taskId), value);
          });
          toast.info('Draft loaded successfully');
        } catch (err: any) {
          toast.error('Failed to load draft:', err);
        }
      }
    }
  }, [enrollId]);

  const saveDraft = (isDraft = false) => {
    if (enrollId && Object.keys(answers).length > 0) {
      localStorage.setItem(draftKey, JSON.stringify(answers));

      if (isDraft) toast.success('Draft saved successfully');
    } else {
      toast.error('No answers to save');
    }
  };

  const submitMutation = useMutation({
    mutationFn: submitStudentCourseExams,
    onSuccess: async () => {
      toast.success('Exam Submitted Successfully');
      localStorage.removeItem(draftKey);
      refetch();
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to submit exam!');
    },
  });

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      saveDraft();
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const isLastSection = currentSectionIndex === sections.length - 1;
  const currentSectionAnswered = currentSectionExams.filter((exam) => answers.hasOwnProperty(exam.id)).length;

  return (
    <div className="">
      {groupExams && sections.length > 0 ? (
        <div className="space-y-5">
          {/*  Overview */}
          <div className="rounded-2xl bg-white shadow-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-5 border-b bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpenCheck className="size-6 text-primary" />
                </div>

                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-900">{data?.exam_type} Exam</h1>
                  <p className="text-sm text-slate-500">
                    {totalQuestions} Questions •{totalPossibleScore} Points
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-primary" />
                  Ends {formatDate(data?.end_date)}
                </span>

            
              </div>
            </div>

            {/* Progress */}
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
          <div className="relative rounded-xl bg-slate-50 border border-slate-200 shadow shadow-primary/10 px-6 py-4">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-l-xl" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">{currentSectionIndex + 1}</div>
                <h2 className="text-xl font-semibold text-slate-900">{currentSection}</h2>
              </div>

              <p className="text-sm text-slate-500 text-right">{currentSectionExams.length} Questions</p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {currentSectionExams.map((exam, index) => {
              const isAnswered = answers.hasOwnProperty(exam.id);

              return (
                <Card key={exam.id} className="border p-1 border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-0 mb-1">
                    <div className="flex items-center justify-between px-4 py-3 border-b rounded-md bg-stone-50">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">{TASK_TITLE[exam.task_type as TaskType]}</span>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold">{exam.points} pts</span>

                        {isAnswered && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                            <CheckCircle2 className="size-3" />
                            Answered
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="bg-white px-5 py-4">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 flex items-center justify-center font-bold text-sm mt-0.5">{index + 1} .</div>

                        <div className="flex-1 min-w-0">
                          <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: exam.question || '' }} />
                        </div>
                      </div>
                    </div>

                    {/* Answer Area */}
                    <div className="p-5 bg-white  ">
                      <TaskRendererComponent task={exam} onAnswer={handleAnswer} value={answers[exam.id]} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Navigation  */}
          <div className="mt-6 flex items-center justify-between py-4">
            <Button onClick={handlePrevious} disabled={currentSectionIndex === 0} className="flex rounded-lg px-5 md:py-5 items-center gap-2">
              <ArrowBigLeft className="size-5" />
              Previous
            </Button>

            {isLastSection ? (
              <div className="flex items-center gap-2">
                <Button variant={'red'} onClick={() => saveDraft(true)} className="  rounded-lg py-5" disabled={Object.keys(answers).length === 0}>
                  <Save className="size-4" />
                  Save Draft
                </Button>

                <Button className="  rounded-lg py-5" onClick={() => submitMutation.mutate({ enroll_id: Number(enrollId), answers })} disabled={submitMutation.isPending}>
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
              <Button onClick={handleNext} className="flex px-5 md:py-5 rounded-lg items-center gap-2">
                Next
                <ArrowBigRight className="size-5" />
              </Button>
            )}
          </div>
        </div>
      ) : (
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
