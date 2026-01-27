import { useCallback, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, TrendingUp, Star, MessageCircle } from 'lucide-react';
import { getPerformanceMessage } from '@/mocks/tasks';
import { StudentExamReviewForm } from '../Form/StudentExamReviewForm';
import type { ClassExamQuestionType } from '@/types/courseexamquestion';
import type { StudentExamAnswersType } from '@/types/studentexamanswer';
import type { StudentAnswer } from '@/types/answer';
import Lottie from 'lottie-react';
import Teacher from '../../../public/lottie/Teacher.json';
import { QuestionResultItem } from '../QuestionResultItem';

interface ExamResultProps {
  studentAnswers?: StudentExamAnswersType;
  questions: ClassExamQuestionType[];
  totalPossibleScore: number;
  isTeacher?: boolean;
  onScoreChange?: (taskId: number, score: number) => void;
  enrollId?: number;
  refetch?: () => void;
}

const Stat = ({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div className="flex items-center gap-1">
      <div className="font-semibold text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  </div>
);

export default function ExamAnswerResult({ studentAnswers, questions, totalPossibleScore, isTeacher = false, onScoreChange, enrollId, refetch }: ExamResultProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const answersMap = useMemo(
    () =>
      studentAnswers?.answers?.reduce<Record<number, StudentAnswer>>((acc, ans) => {
        acc[ans.id] = ans;
        return acc;
      }, {}) ?? {},
    [studentAnswers],
  );

  const parsedAnswers = useMemo(() => {
    const map: Record<number, any> = {};
    Object.values(answersMap).forEach((ans) => {
      if (typeof ans.answer === 'string') {
        try {
          map[ans.id] = JSON.parse(ans.answer);
        } catch {
          map[ans.id] = ans.answer;
        }
      } else {
        map[ans.id] = ans.answer;
      }
    });
    return map;
  }, [answersMap]);

  const getParsedAnswer = useCallback((taskId: number) => parsedAnswers[taskId], [parsedAnswers]);
  const totalScore = useMemo(() => Object.values(answersMap).reduce((sum, ans) => sum + Number(ans.score), 0), [answersMap]);
  const percentage = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
  const correctAnswers = useMemo(() => Object.values(answersMap).filter((a) => a.is_correct && a.score > 0).length, [answersMap]);
  const performanceMessage = getPerformanceMessage(percentage);
  const isPendingStudent = studentAnswers?.status === 'Pending' && !isTeacher;
  const isCompletedStudent = studentAnswers?.status === 'Approved' && !isTeacher;

  return (
    <div className="min-h-screen px-4">
      {isPendingStudent && (
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Lottie animationData={Teacher} loop className="mx-auto w-64 h-64" />
          <p className="text-lg text-slate-700 font-medium">Your exam has been submitted successfully</p>
          <p className="text-sm text-slate-600">The teacher is reviewing your answers.</p>
        </div>
      )}

      {(isCompletedStudent || isTeacher) && (
        <div className="mx-auto space-y-5">
          {isTeacher && (
            <div className="flex justify-end ">
              <Button variant={'default'} className="px-14 gap-2 py-5" onClick={() => setIsReviewDialogOpen(true)}>
                <MessageCircle className="size-5" />
                {studentAnswers?.review !== null || studentAnswers?.review == '' ? 'Update' : 'Give'} Student Review
              </Button>
            </div>
          )}

          {!isTeacher && (
            <div className="text-center">
              <div className="inline-flex items-center gap-1 px-5 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                <Star className="size-4 text-yellow-500" />
                Exam Completed
                <Star className="size-4 text-yellow-500" />
              </div>
            </div>
          )}

          <Card className={`px-5 py-6 border ${performanceMessage.borderColor} ${performanceMessage.bgColor}`}>
            <div className="flex flex-col md:flex-row flex-wrap md:justify-between gap-4">
              <div>
                <h2 className={`text-xl font-semibold ${performanceMessage.color}`}>{studentAnswers?.review ? studentAnswers?.review : performanceMessage.text}</h2>
                <p className="text-sm text-slate-600">Exam completed · {percentage}%</p>
              </div>

              <div className="flex items-center gap-5 text-sm">
                <Stat icon={<CheckCircle className="w-5 h-5 text-green-600" />} value={correctAnswers} label="Correct" />
                <Stat icon={<XCircle className="w-5 h-5 text-red-600" />} value={questions.length - correctAnswers} label="Wrong" />
                <Stat icon={<TrendingUp className="w-5 h-5 text-blue-600" />} value={`${totalScore}/${totalPossibleScore}`} label="Points" />
              </div>
            </div>
            {studentAnswers?.sections && studentAnswers.sections.length > 0 && (
              <div className="mt-4 pt-4 border-t ">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Section Scores</h3>

                <div className=" grid grid-cols-2 lg:grid-cols-3 items-center gap-4">
                  {studentAnswers.sections.map((section, index) => (
                    <div key={index} className={`flex justify-between items-center px-3 py-3 rounded-md  bg-white/70 shadow-xs border-slate-400 border text-sm`}>
                      <p className="inline-flex text-slate-700 font-semibold">
                        Section {section.name}: <span className="ml-2 font-bold">{section.title}</span>
                      </p>

                      <Stat icon={<TrendingUp className="w-5 h-5 text-blue-600" />} value={`${section.total_score}/${section.total_possible_score}`} label="Points" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {isTeacher && (
            <div className="grid gap-4">
              {questions.map((q, i) => {
                const ans = answersMap[q.id];
                const status = ans?.is_correct && ans.score > 0 ? 'correct' : ans?.is_correct === null && q.task_type === 'long' ? 'reviewing' : 'incorrect';

                return (
                  <QuestionResultItem
                    key={q.id}
                    question={q}
                    index={i}
                    answer={ans}
                    status={status}
                    parsedAnswer={getParsedAnswer(q.id)}
                    isTeacher={isTeacher}
                    onScoreChange={onScoreChange}
                    enrollId={enrollId}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {isTeacher && <StudentExamReviewForm open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen} studentExamAnswer={studentAnswers} refetch={refetch || (() => {})} />}
    </div>
  );
}
