import { Button } from '@/components/ui/button';
import { BookOpenCheck, Play, Clock, HelpCircle, Trophy, Layers, Calendar, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/utils/format';
import type { ClassRoomExamType } from '@/types/classexam';
import type { ClassExamSectionType } from '@/types/courseexamsection';

interface ExamStartScreenProps {
  data: ClassRoomExamType | undefined;
  totalQuestions: number;
  totalPossibleScore: number;
  sections: ClassExamSectionType[];
  onStartExam: () => void;
}

export default function ExamStartScreen({ data, totalQuestions, totalPossibleScore, sections, onStartExam }: ExamStartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl rounded-2xl w-full py-5 px-8">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <BookOpenCheck className="size-10 text-primary" />
          </div>

          <h1 className="text-3xl font-semibold text-slate-900 mb-3">{data?.exam_type} Exam</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left w-full">
            {/* Duration */}
            <div
              className="flex items-center justify-between py-3 px-4 rounded-xl
                  bg-blue-50 border border-blue-100
                  hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-blue-500" />
                <span className="text-blue-700 font-medium">Duration</span>
              </div>
              <span className="font-semibold text-blue-900">{data?.exam?.total_duration} min</span>
            </div>

            {/* Questions */}
            <div
              className="flex items-center justify-between py-3 px-4 rounded-xl
                  bg-violet-50 border border-violet-100
                  hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="size-4 text-violet-500" />
                <span className="text-violet-700 font-medium">Questions</span>
              </div>
              <span className="font-semibold text-violet-900">{totalQuestions}</span>
            </div>

            {/* Points */}
            <div
              className="flex items-center justify-between py-3 px-4 rounded-xl
                  bg-amber-50 border border-amber-100
                  hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-amber-500" />
                <span className="text-amber-700 font-medium">Points</span>
              </div>
              <span className="font-semibold text-amber-900">{totalPossibleScore}</span>
            </div>

            {/* Sections */}
            <div
              className="flex items-center justify-between py-3 px-4 rounded-xl
                  bg-emerald-50 border border-emerald-100
                  hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-emerald-500" />
                <span className="text-emerald-700 font-medium">Sections</span>
              </div>
              <span className="font-semibold text-emerald-900">{sections.length}</span>
            </div>

            {/* End Date */}
            <div
              className="flex items-center justify-between py-3 px-4 rounded-xl
                  bg-rose-50 border border-rose-100
                  hover:shadow-sm transition md:col-span-2"
            >
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-rose-500" />
                <span className="text-rose-700 font-medium">End Date</span>
              </div>
              <span className="font-semibold text-rose-900">{formatDate(data?.end_date)}</span>
            </div>
          </div>

          {data?.exam?.intro && (
            <div className="w-full bg-slate-100 border rounded-lg p-4 mb-6 text-left">
              <div className="text-sm text-slate-700 leading-relaxed prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: data?.exam.intro }} />
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 w-full">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Once you start the exam, the timer will begin and cannot be paused. Make sure you're ready before clicking the Start button.
              </p>
            </div>
          </div>

          <Button onClick={onStartExam} size="lg" className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg">
            <Play className="size-5 mr-2" />
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
