import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';
import moment from 'moment';
import type { ClassRoomType } from '@/types/class';
import { Link } from 'react-router-dom';
import { displayTime } from '@/helper/ClassRoom';
import { deleteClassConversations } from '@/services/classService';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../ui/dialog-context-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ClassRoomTableProps {
  classrooms: ClassRoomType[];
  onEdit?: (classroom: ClassRoomType) => void;
  onDelete?: (id: number) => void;
  isCoureDetail?: boolean;
}

export default function ClassRoomTable({ classrooms, onEdit, onDelete, isCoureDetail = false }: ClassRoomTableProps) {
  const [deletingConvId, setDeletingConvId] = useState<number | null>(null);
  const [conversatioOpen, setconversatioOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteConversationMutation = useMutation({
    mutationFn: (id: number) => deleteClassConversations(id),
    onSuccess: async (_, id) => {
      toast.success('Finished Classroom & deleted conversation successfully');
      await queryClient.invalidateQueries({ queryKey: ['classes', id] });
      setconversatioOpen(false);
      setDeletingConvId(null);
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete lesson!'),
  });

  const askDeleteConversation = (id: number) => {
    setDeletingConvId(id);
    setconversatioOpen(true);
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
              {/* <th className="px-4 py-3 font-medium">Status</th> */}
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
                    {/* {classroom.days.map((day, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 rounded bg-green-300/10 text-green-700 text-xs uppercase'>
                        {day}
                      </span>
                  ))} */}

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
                {/* <td className="px-4 py-3 text-muted-foreground">{classroom.teacher ? `${classroom.teacher.first_name} ${classroom.teacher.last_name}` : '-'}</td> */}
                {/* <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${classroom.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {classroom.is_active ? 'Active' : 'Inactive'}
                </span>
              </td> */}
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
                        <Button className="hover:scale-100" size="sm" onClick={() => askDeleteConversation(classroom.id)}>
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
        open={conversatioOpen}
        onOpenChange={setconversatioOpen}
        title="Finish Classrooom & Delete Coversation ?"
        description="This action cannot be undone. The classroom conversation will be permanently removed."
        confirmText="Finish"
        cancelText="Cancel"
        loading={deleteConversationMutation.isPending}
        destructive={false}
        onCancel={() => {
          setconversatioOpen(false);
          setDeletingConvId(null);
        }}
        onConfirm={() => {
          if (deletingConvId != null) deleteConversationMutation.mutate(deletingConvId);
        }}
      />
    </div>
  );
}
