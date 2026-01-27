import { Button } from '@/components/ui/button';
import {
  BookOpenCheck,
  Play,
  Clock,
  HelpCircle,
  Trophy,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import type { ClassRoomExamType } from '@/types/classexam';
import type { ClassExamSectionType } from '@/types/courseexamsection';

interface ExamStartScreenProps {
  data: ClassRoomExamType | undefined;
  totalQuestions: number;
  totalPossibleScore: number;
  sections: ClassExamSectionType[];
  onStartExam: () => void;
}

export default function ExamStartScreen({
  data,
  totalQuestions,
  totalPossibleScore,
  sections,
  onStartExam,
}: ExamStartScreenProps) {
  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl space-y-8">

        {/* HEADER */}
        <div className="rounded-2xl border bg-transparent p-8 shadow-sm text-center space-y-6">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpenCheck className="size-8 text-primary" />
          </div>

          <h1 className="text-3xl font-semibold text-slate-900">
            {data?.exam_type} Exam
          </h1>

         

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Clock}
            label="Duration"
            value={`${data?.exam?.total_duration} min`}
            color="blue"
          />

             <StatCard
            icon={Layers}
            label="Sections"
            value={sections.length}
            color="emerald"
          />
          
          <StatCard
            icon={HelpCircle}
            label="Questions"
            value={totalQuestions}
            color="violet"
          />
          <StatCard
            icon={Trophy}
            label="Total Points"
            value={totalPossibleScore}
            color="amber"
          />
       
       
        </div>

         <p className="mt-2 text-sm text-red-600">
            Please review the exam details before starting
          </p>

        </div>


        {/* INTRO */}
        {data?.exam?.intro && (
          <div className="rounded-xl border bg-slate-50 p-6">
            <div
              className="prose prose-slate max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: data.exam.intro }}
            />
          </div>
        )}

        {/* WARNING */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Important:</strong> Once you start the exam, the timer
              begins immediately and cannot be paused. Ensure you are fully
              prepared before starting.
            </p>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-center">
          <Button
            onClick={onStartExam}
            size="lg"
            className="gap-2 px-10 py-6 text-lg shadow-md hover:shadow-lg"
          >
            <Play className="size-5" />
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------
   STAT CARD
--------------------------------- */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  className,
}: {
  icon: any;
  label: string;
  value: any;
  color: 'blue' | 'violet' | 'amber' | 'emerald' | 'rose';
  className?: string;
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
  };

  return (
    <div
      className={`rounded-xl border bg-white p-4 flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${colorMap[color]}`}>
          <Icon className="size-4" />
        </div>
        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>
      </div>

      <span className="text-lg font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}
