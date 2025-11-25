import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import moment from 'moment';
import type { ClassRoomType } from '@/types/class';
import { Link } from 'react-router-dom';

interface ClassRoomTableProps {
  classrooms: ClassRoomType[];
  onEdit?: (classroom: ClassRoomType) => void;
  onDelete?: (id: number) => void;
  isCoureDetail?: boolean;
}

export default function ClassRoomTable({ classrooms, onEdit, onDelete, isCoureDetail = false }: ClassRoomTableProps) {
  const displayTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) return '';
    return `${parseInt(hours, 10)}:${minutes.padStart(2, '0')}`;
  };

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium">Class Name</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">Time</th>
            <th className="px-4 py-3 font-medium">Teacher</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {isCoureDetail && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom.id} className="border-t group hover:bg-muted transition-colors">
              <td className="px-4 py-3 font-medium hover:text-primary hover:underline hover:underline-offset-3 transition-colors duration-300">
                <Link to={`/teacher/courses/classes/${classroom.id}`}>{classroom.class_name}</Link>{' '}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {moment(classroom.start).format('MMM DD')} - {moment(classroom.end).format('MMM DD, YYYY')}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {displayTime(classroom.start_time)} - {displayTime(classroom.end_time)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{classroom.teacher ? `${classroom.teacher.first_name} ${classroom.teacher.last_name}` : '-'}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${classroom.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {classroom.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              {isCoureDetail && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="primary" size="sm" onClick={() => onEdit?.(classroom)}>
                      <Edit className="size-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete?.(classroom.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
