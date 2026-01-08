import { Button } from '@/components/ui/button';
import { Edit, FileText } from 'lucide-react';
import moment from 'moment';
import type { ClassRoomExamType } from '@/types/classexam';

interface ClassExamsTableProps {
  exams: ClassRoomExamType[];
  onEdit?: (exam: ClassRoomExamType) => void;
}

export default function ClassExamsTable({ exams, onEdit }: ClassExamsTableProps) {
  return (
    <div className="overflow-x-auto rounded-md">
      {exams?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <FileText className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-1">No exams yet</h4>
          <p className="text-sm text-muted-foreground mb-4">Create your first exam to get started</p>
        </div>
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-stone-100">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Exam Type</th>
              <th className="px-4 py-3 font-medium">Start Date</th>
              <th className="px-4 py-3 font-medium">End Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-t  border-gray-300 group hover:bg-stone-100 transition-colors">
                <td className="px-4 py-3 text-left font-medium text-primary">{exam.exam_type || ''}</td>
                <td className="px-4 py-3 text-left text-muted-foreground">{exam.start_date ? moment(exam.start_date).format('MMM DD, YYYY') : ''}</td>
                <td className="px-4 py-3 text-left text-muted-foreground">{exam.end_date ? moment(exam.end_date).format('MMM DD, YYYY') : ''}</td>
                <td className="px-4 py-3 text-left">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="primary" size="sm" onClick={() => onEdit?.(exam)}>
                      <Edit className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
