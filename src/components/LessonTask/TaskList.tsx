import type { LessonTaskType } from '@/types/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '@/services/lessonTaskService';
import { toast } from 'sonner';
import { useState } from 'react';
import { ConfirmDialog } from '../ui/dialog-context-menu';
import TaskBuilderManager from './TaskManager';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { mapTaskToBuilderInitial } from '@/helper/mapTaskToBuilderInitial';
import LongQuestionRender from '../Teacher/TaskRender/LongQuestionRender';
import ShortQuestionRender from '../Teacher/TaskRender/ShortQuestionRender';
import MCQQuestionRender from '../Teacher/TaskRender/MCQQuestionRender';
import DragDropRender from '../Teacher/TaskRender/DragDropRender';
import MatchingQuestionRender from '../Teacher/TaskRender/MatchingQuestionRender';
import ParagraphQuestionRender from '../Teacher/TaskRender/ParagraphQuestionRender';


interface TaskListProps {
  tasks?: LessonTaskType[];
  refetch: () => Promise<any>;
}


export default function TaskList({ tasks = [], refetch }: TaskListProps) {
  const mcqTasks = tasks.filter((t) => t.task_type === 'mcq');
  const tfTasks = tasks.filter((t) => t.task_type === 'true_false');
  const blankTasks = tasks.filter((t) => t.task_type === 'fill_blank');
  const matchingTasks = tasks.filter((t) => t.task_type === 'matching');
  const dragTasks = tasks.filter((t) => t.task_type === 'drag_drop');
  const longTasks = tasks.filter((t) => t.task_type === 'long');
  const shortTasks = tasks.filter((t) => t.task_type === 'short');
  const paragraphDragTasks = tasks.filter((t) => t.task_type === 'paragraph_drag');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<LessonTaskType | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: async () => {
      toast.success('Task Deleted Successfully');
      await queryClient.invalidateQueries({ queryKey: ['task', deletingId] });
      setConfirmOpen(false);
      setDeletingId(null);
      refetch();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete'),
  });

  const askDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const openEditDialog = (task: LessonTaskType) => {
    setEditingTask(task);
    setEditOpen(true);
  };

  const sections = [
  {
    key: 'long',
    title: 'Long Questions',
    tasks: longTasks,
    Component: LongQuestionRender,
  },
  {
    key: 'short',
    title: 'Short Questions',
    tasks: shortTasks,
    Component: ShortQuestionRender,
  },
  {
    key: 'blank',
    title: 'Fill in the Blanks Questions',
    tasks: blankTasks,
    Component: ShortQuestionRender,
  },
  {
    key: 'mcq',
    title: 'Multiple Choice Questions',
    tasks: mcqTasks,
    Component: MCQQuestionRender,
  },
  {
    key: 'tf',
    title: 'True / False Questions',
    tasks: tfTasks,
    Component: MCQQuestionRender,
  },
  {
    key: 'drag',
    title: 'Drag & Drop Questions',
    tasks: dragTasks,
    Component: DragDropRender,
  },
  {
    key: 'matching',
    title: 'Matching Questions',
    tasks: matchingTasks,
    Component: MatchingQuestionRender,
  },
  {
    key: 'paragraph',
    title: 'Paragraph (Dropdown Blanks)',
    tasks: paragraphDragTasks,
    Component: ParagraphQuestionRender,
  },
];


  return (
    <div className="space-y-8">
     {sections.map(({ key, title, tasks, Component }) =>
      tasks.length > 0 ? (
        <Component
          key={key}
          type={title}
          tasks={tasks}
          onEdit={openEditDialog}
          onDelete={askDelete}
        />
      ) : null
    )}

      {/* Edit Dialog*/}
      <Dialog open={editOpen} onOpenChange={setEditOpen} modal={false}>
        <DialogTrigger />
        <DialogContent className="w-[85vw] max-w-none max-h-[95vh] overflow-y-auto p-6" onCloseAutoFocus={(e) => e.preventDefault()} onOpenAutoFocus={(e) => e.preventDefault()}>
          {editingTask && (
            <>
              <DialogTitle>Edit Task</DialogTitle>
              <TaskBuilderManager
                initial={{
                  task_type: editingTask.task_type,
                  points: editingTask.points,
                  question: editingTask.question,
                  lesson_id: editingTask.lesson_id,
                  extra_data: mapTaskToBuilderInitial(editingTask),
                }}
                taskId={editingTask.id}
                lessonId={editingTask.lesson_id}
                refetch={refetch}
                onClose={() => setEditOpen(false)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Task?"
        description="This action cannot be undone. The class will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        destructive
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingId(null);
        }}
        onConfirm={() => {
          if (deletingId != null) deleteMutation.mutate(deletingId);
        }}
      />
    </div>
  );
}
