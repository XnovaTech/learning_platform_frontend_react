import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';
import moment from 'moment';
import type { ClassRoomType } from '@/types/class';
import { Link } from 'react-router-dom';
import { displayTime } from '@/helper/ClassRoom';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../ui/dialog-context-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { finishClass } from '@/services/classService';

interface ClassRoomTableProps {
  classrooms: ClassRoomType[];
  onEdit?: (classroom: ClassRoomType) => void;
  onDelete?: (id: number) => void;
  isCoureDetail?: boolean;
  courseId?: number;
}

export default function ClassRoomTable({ classrooms, onEdit, onDelete, isCoureDetail = false, courseId }: ClassRoomTableProps) {
  const [finishOpen, setFinishOpen] = useState(false);
  const [classId, setClassId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const finishMutation = useMutation({
    mutationFn: (id: number) => finishClass(id),
    onSuccess: async () => {
      toast.success('Finished Classroom successfully');
      await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      setFinishOpen(false);
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to finish class!'),
  });

  const askFinishClass = (classId: number) => {
    setFinishOpen(true);
    setClassId(classId);
  };

  return (
    <div className="overflow-x-auto rounded-md">
      {classrooms?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <Users className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-1">No class rooms yet</h4>
          <p className="text-sm text-muted-foreground mb-4">Create your first class room to get started</p>
        </div>
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Class Name</th>
              <th className="px-4 py-3 font-medium">Days</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Time</th>
              {isCoureDetail && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom.id} className="border-t group hover:bg-muted transition-colors">
                <td className="px-4 py-3 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-3 transition-colors duration-300">
                  <Link to={`/teacher/courses/classes/${classroom.id}`}>{classroom.class_name}</Link>{' '}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex gap-2 flex-wrap">
                    {classroom?.days.length > 0 && (
                      <div className="flex flex-wrap gap-1.5  border-blue-100 bg-blue-100 w-fit px-2 py-1 rounded-sm text-blue-700 ">
                        {classroom?.days?.map((day, index) => (
                          <span key={day} className="text-xs capitalize" title={day}>
                            {day}
                            {index < classroom.days.length - 1 && ','}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {moment(classroom.start).format('MMM DD')} - {moment(classroom.end).format('MMM DD, YYYY')}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {displayTime(classroom.start_time)} - {displayTime(classroom.end_time)}
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

                      {classroom?.is_finish == 0 && (
                        <Button className="hover:scale-100" size="sm" onClick={() => askFinishClass(classroom.id)}>
                          Finish
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={finishOpen}
        onOpenChange={setFinishOpen}
        title="Finish Classroom ?"
        description="This action cannot be undone. Are you sure want to finish this classroom ?"
        confirmText="Finish"
        cancelText="Cancel"
        loading={finishMutation.isPending}
        destructive={false}
        onCancel={() => {
          setFinishOpen(false);
          setClassId(null);
        }}
        onConfirm={() => {
          if (classId != null) finishMutation.mutate(classId);
        }}
      />
    </div>
  );
}
