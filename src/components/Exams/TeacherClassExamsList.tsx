import { Button } from '@/components/ui/button';
import { BookOpenCheck, Plus } from 'lucide-react';
import type { ClassRoomExamPayloadType, ClassRoomExamType } from '@/types/classexam';
import ClassExamsTable from '../Table/ClassExamsTable';
import { ClassExamForm } from './ClassExamForm';
import { useState } from 'react';

interface ClassExamsTableProps {
  exams: ClassRoomExamType[];
  classId: number;
}

export default function TeacherClassExamsList({ exams, classId }: ClassExamsTableProps) {
  const [examFormOpen, setExamFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ClassRoomExamType | null>(null);
  const defaultExamForm: ClassRoomExamPayloadType = {
    class_id: classId,
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
    <div className="drop-shadow-2xl backdrop-blur-lg bg-white/50 dark:bg-slate-900/80 rounded-2xl p-6 md:p-8 text-center">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <BookOpenCheck size={22} />
          Exams
        </h2>

        <Button type="button" size="sm" className="gap-2  shadow-sm w-full sm:w-auto"  onClick={openCreateExam}>
          <Plus className="size-4" /> Create Exam
        </Button>
      </div>

      <ClassExamsTable exams={exams || []} onEdit={openEditExam} />

      <ClassExamForm open={examFormOpen} onOpenChange={setExamFormOpen} editingItem={editingExam} classId={classId} form={examForm} setForm={setExamForm} onSuccess={handleExamFormSuccess} />
    </div>
  );
}
