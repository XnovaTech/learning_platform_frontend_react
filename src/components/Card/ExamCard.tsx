import { BookOpenCheck, CalendarDays, ArrowRight, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ClassRoomExamType, ClassRoomExamPayloadType } from '@/types/classexam';
import { formatDate } from '@/utils/format';
import { Link } from 'react-router-dom';
import { Card, CardTitle } from '../ui/card';
import { useState } from 'react';
import { ClassExamForm } from '../Form/ClassExamForm';

interface Props {
  exams: ClassRoomExamType[];
  enrollId?: number;
  courseId?: number;
  classId?: number;
  isTeacher?: Boolean;
}

export default function ExamCard({ exams, enrollId, courseId, classId, isTeacher = false }: Props) {
  const [examFormOpen, setExamFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ClassRoomExamType | null>(null);
  const defaultExamForm: ClassRoomExamPayloadType = {
    class_id: classId || 0,
    exam_type: null,
    start_date: null,
    end_date: null,
  };

  const [examForm, setExamForm] = useState<ClassRoomExamPayloadType>(defaultExamForm);

  const openEditExam = (exam: ClassRoomExamType) => {
    setEditingExam(exam);
    setExamForm({
      class_id: exam.class_id,
      exam_type: exam.exam_type,
      start_date: exam.start_date,
      end_date: exam.end_date,
    });
    setExamFormOpen(true);
  };

  const openCreateExam = () => {
    setEditingExam(null);
    setExamForm(defaultExamForm);
    setExamFormOpen(true);
  };

  const handleExamFormSuccess = () => {
    setExamFormOpen(false);
    setEditingExam(null);
  };

  return (
    <div>
      <Card className="rounded-2xl border-none bg-white/70 backdrop-blur-xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <BookOpenCheck size={22} />
            Exams
          </CardTitle>

          {isTeacher && (
            <Button type="button" size="sm" className="gap-2  shadow-sm w-full sm:w-auto" onClick={openCreateExam}>
              <Plus className="size-4" /> Create Exam
            </Button>
          )}
        </div>
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
            return (
              <div
                key={exam.id}
                className=" h-full border relative    bg-white hover:border-primary/30 hover:shadow-md overflow-hidden   p-5 shadow-sm transition-all duration-300 transform rounded-2xl hover:-translate-y-1 "
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <BookOpenCheck className="size-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{exam.exam_type || 'Exam'}</h3>
                </div>

                {isTeacher && (
                  <Button className="absolute top-5 right-5"  size="sm" variant="primary" onClick={() => openEditExam(exam)}>
                    <Edit className="size-4" />
                  </Button>
                )}

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

                  {isTeacher ? (
                    <Link to={`/teacher/courses/${courseId}/classes/${exam?.class_id}/exams/${exam?.id}/records`}>
                      <Button variant="default" className="min-w-36  gap-2 font-semibold">
                        Exam Records
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/student/enrolls/${enrollId}/exams/${exam.id}`}>
                      <Button variant="default" className="w-32  gap-2 font-semibold">
                        Enter Exam
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <ClassExamForm open={examFormOpen} onOpenChange={setExamFormOpen} editingItem={editingExam} classId={classId || 0} form={examForm} setForm={setExamForm} onSuccess={handleExamFormSuccess} />
    </div>
  );
}
