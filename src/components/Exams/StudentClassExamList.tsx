import { BookOpenCheck, CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ClassRoomExamType } from '@/types/classexam';
import { formatDate } from '@/utils/format';
import { Card, CardTitle } from '../ui/card';
import { Link } from 'react-router-dom';

interface Props {
  exams: ClassRoomExamType[];
  enrollId?: number;
}

function getExamStatus(start: string | null, end: string | null) {
  if (!start || !end) return { label: 'Not Set', color: 'bg-gray-100 text-gray-600' };

  const today = new Date().setHours(0, 0, 0, 0);
  const startDate = new Date(start).setHours(0, 0, 0, 0);
  const endDate = new Date(end).setHours(0, 0, 0, 0);

  if (today < startDate) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-600' };
  if (today > endDate) return { label: 'Ended', color: 'bg-gray-100 text-gray-600' };

  return { label: 'Ongoing', color: 'bg-green-100 text-green-600' };
}

export default function StudentClassExamList({ exams, enrollId }: Props) {
  return (
    <Card className="rounded-2xl border-none bg-white/70 backdrop-blur-xl shadow-xl p-6 md:p-8">
      <CardTitle className="text-xl mb-3 font-semibold text-gray-800  flex items-center gap-2">
        <BookOpenCheck size={22} />
        Exams
      </CardTitle>

      {exams.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <BookOpenCheck className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold">No Exams Available </h4>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
        {exams.map((exam) => {
          const status = getExamStatus(exam.start_date, exam.end_date);

          return (
            <div
              key={exam.id}
              className="relative h-full border     bg-white hover:border-primary/30 hover:shadow-md overflow-hidden   p-5 shadow-sm transition-all duration-300 transform rounded-2xl hover:-translate-y-1 "
            >
              <span className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>{status.label}</span>

              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <BookOpenCheck className="size-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{exam.exam_type || 'Exam'}</h3>
              </div>

              <div className="flex flex-wrap  items-center gap-5 justify-between ">
                {/* Dates */}

                <div className="flex  items-center gap-3 ">
                  <div className="mt-1 rounded-lg bg-red-100 p-2">
                    <CalendarDays className="size-5 text-red-600" />
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground uppercase tracking-wide text-xs mb-1">Exam Dates</p>
                    <p className="font-medium">
                      {formatDate(exam.start_date)} – {formatDate(exam.end_date)}
                    </p>
                  </div>
                </div>

                <Link to={`/student/enrolls/${enrollId}/exams/${exam.id}`}>
                  <Button variant="default" className="w-32  gap-2 font-semibold">
                    Enter Exam
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
