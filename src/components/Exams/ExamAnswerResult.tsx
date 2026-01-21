import { Card } from '@/components/ui/card';
import type { CourseExamType } from '@/types/task';
import type { StudentExamAnswersType } from '@/types/answer';
import { CheckCircle, XCircle, TrendingUp, AlertCircle, Star } from 'lucide-react';
import TaskRendererComponent from '../Student/Enroll/Tasks/Render/TaskRendererComponent';
import { getPerformanceMessage } from '@/mocks/tasks';

interface ExamResultProps {
  studentAnswers?: StudentExamAnswersType;
  courseExams: CourseExamType[];
  totalPossibleScore: number;
  isTeacher?: boolean;
  onScoreChange?: (taskId: number, score: number) => void;
  enrollId?: number;
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="leading-tight flex items-center gap-1 ">
        <div className="font-semibold   text-slate-800">{value}</div>
        <div className="text-sm l text-slate-500">{label}</div>
      </div>
    </div>
  );
}

export default function ExamAnswerResult({ studentAnswers, courseExams, totalPossibleScore, isTeacher = false, onScoreChange,enrollId }: ExamResultProps) {
  const totalScore = Object.values(studentAnswers || {}).reduce((sum, ans) => Number(sum) + Number(ans.score), 0);
  const percentage = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
  const correctAnswers = Object.values(studentAnswers || {}).filter((ans) => ans.is_correct && ans.score > 0).length;
  const totalQuestions = courseExams.length;
  const performanceMessage = getPerformanceMessage(percentage);

  const getParsedAnswer = (taskId: number) => {
    const record = studentAnswers?.[taskId];
    if (!record) return undefined;
    const raw = record.answer;

    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }

    return raw;
  };

  return (
    <div className="min-h-screen px-4">
      <div className=" mx-auto space-y-5">
        {!isTeacher && (
          <div className="text-center ">
            <div className="inline-flex items-center gap-1 px-5 py-2 rounded-full bg-gradient-to-r from-primary/5 to-primary/12 text-primary font-semibold shadow-sm">
              <Star className="size-4 text-yellow-500" />
              Exam Completed !
              <Star className="size-4 text-yellow-500" />
            </div>
          </div>
        )}

        {/*  Summary Card */}
        <Card className={`px-5 py-6 border ${performanceMessage.borderColor} ${performanceMessage.bgColor}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className={`text-xl font-semibold ${performanceMessage.color}`}>{performanceMessage.text}</h2>
              <p className="text-sm text-slate-600">Exam completed · {percentage}% score</p>
            </div>

            <div className="flex items-center gap-5 text-sm">
              <Stat icon={<CheckCircle className="w-5 h-5 text-green-600" />} value={correctAnswers} label="Correct" />
              <Stat icon={<XCircle className="w-5 h-5 text-red-600" />} value={totalQuestions - correctAnswers} label="Wrong" />
              <Stat icon={<TrendingUp className="w-5 h-5 text-blue-600" />} value={`${totalScore}/${totalPossibleScore}`} label="Points" />
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-2 pt-4">
          <AlertCircle className="w-5 h-5 text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-800">Detailed Review</h3>
        </div>

        {/* Questions  */}
        <div className="grid gap-4">
          {courseExams.map((exam, index) => {
            const answer = studentAnswers?.[exam.id];
            const isCorrect = answer ? answer.is_correct && answer.score > 0 : false;
            const isReviewing = answer && answer.is_correct === null && exam.task_type === 'long';
            const status = isCorrect ? 'correct' : isReviewing ? 'reviewing' : 'incorrect';

            return (
              <Card
                key={exam.id}
                className={`p-3 transition-all hover:shadow-md border-l-4 ${
                  status === 'correct' ? 'border-l-green-500 bg-green-50/30' : status === 'reviewing' ? 'border-l-yellow-500 bg-yellow-50/30' : 'border-l-red-500 bg-red-50/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      status === 'correct' ? 'bg-green-100 text-green-700' : status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div
                      className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800 font-medium"
                      dangerouslySetInnerHTML={{
                        __html: exam.question || '',
                      }}
                    />

                    {/* Answer Section */}
                    <div className="bg-white rounded-lg p-3 space-y-2 border border-slate-200">
                    <TaskRendererComponent
                        task={exam}
                        value={getParsedAnswer(exam.id)}
                        readonly={true}
                        score={studentAnswers?.[exam.id]?.score}
                        onScoreChange={isTeacher ? onScoreChange : undefined}
                        isTeacher={isTeacher}
                        enrollId={enrollId}
                      />

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {status === 'correct' ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-semibold text-green-600">Correct</span>
                            </>
                          ) : status === 'reviewing' ? (
                            <>
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-600">Teacher is reviewing</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-600" />
                              <span className="text-sm font-semibold text-red-600">Incorrect</span>
                            </>
                          )}
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                            status === 'correct' ? 'bg-green-100 text-green-700' : status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {answer?.score || 0} / {exam.points || 0} pts
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
