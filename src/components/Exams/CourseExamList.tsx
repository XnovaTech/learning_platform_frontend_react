import { deleteExam } from '@/services/courseExamService';
import type { CourseExamType } from '@/types/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../ui/dialog-context-menu';
import { mapTaskToBuilderInitial } from '@/helper/mapTaskToBuilderInitial';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import UpdateExam from './UpdateExam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ExamLongRender from '../Teacher/ExamRender/ExamLongRender';
import ExamShortRender from '../Teacher/ExamRender/ExamShortRender';
import ExamMCQRender from '../Teacher/ExamRender/ExamMCQRender';
import ExamDragDropRender from '../Teacher/ExamRender/ExamDragDropRender';
import ExamMatchingRender from '../Teacher/ExamRender/ExamMatchingRender';
import ExamParagraphRender from '../Teacher/ExamRender/ExamParagraphRender';

type Props = {
  exams: CourseExamType[];
  refetch: () => void;
};

export default function CourseExamList({ exams, refetch }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<CourseExamType | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteExam(id),
    onSuccess: async () => {
      toast.success('Exam deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['courseExams'] });
      setConfirmOpen(false);
      setDeletingId(null);
      refetch();
    },
    onError: (error: any) => toast.error(error?.message || 'Failed to delete exam'),
  });

  const askDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const openEditDialog = (task: CourseExamType) => {
    setEditingTask(task);
    setEditOpen(true);
  };

  const examsByExamType = exams.reduce<Record<string, CourseExamType[]>>((acc, exam) => {
    const key = exam.exam_section || 'unknown';

    if (!acc[key]) acc[key] = [];
    acc[key].push(exam);

    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <Tabs defaultValue={Object.keys(examsByExamType)[0]} className="w-full">
        <TabsList className="rounded-2xl bg-white shadow h-11 mb-4">
          {Object.keys(examsByExamType).map((examType) => (
            <TabsTrigger key={examType} value={examType} className="gap-2 rounded-xl px-6 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {examType.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      
      {Object.entries(examsByExamType).map(([examType, examList]) => {
        const mcqTasks = examList.filter((exam) => exam.task_type === 'mcq');
        const tfTasks = examList.filter((exam) => exam.task_type === 'true_false');
        const shortTasks = examList.filter((exam) => exam.task_type === 'short');
        const longTasks = examList.filter((exam) => exam.task_type === 'long');
        const blankTasks = examList.filter((exam) => exam.task_type === 'fill_blank');
        const matchingTasks = examList.filter((exam) => exam.task_type === 'matching');
        const dragTasks = examList.filter((exam) => exam.task_type === 'drag_drop');
        const paragraphDragTasks = examList.filter((exam) => exam.task_type === 'paragraph_drag');

        return (
          <TabsContent key={examType} value={examType} className="space-y-8">
           

            {/** ------------  Long Questions -------------- */}
            {longTasks.length > 0 && (
              <ExamLongRender type="Long Questions" tasks={longTasks} onEdit={openEditDialog} onDelete={askDelete} />
            )}

            {/* ---------------- SHORT QUESTIONS ---------------- */}
            {shortTasks.length > 0 && (
              <ExamShortRender type="Short Questions" tasks={shortTasks} onEdit={openEditDialog} onDelete={askDelete} />
            )}

            {/** -------------  Fill in The Questions ------------- */}
            {blankTasks.length > 0 && (
              <ExamShortRender type="Fill in the Blanks Questions" tasks={blankTasks} onEdit={openEditDialog} onDelete={askDelete} />
            )}

            {/* ---------------- MCQ ---------------- */}
            {mcqTasks.length > 0 && (
              <ExamMCQRender type="Multiple Choice Questions" tasks={mcqTasks} onEdit={openEditDialog} onDelete={askDelete} />
            )}

            {/* ---------------- TRUE / FALSE ---------------- */}
            {tfTasks.length > 0 && (
              <ExamMCQRender type="True / False Questions" tasks={tfTasks} onEdit={openEditDialog} onDelete={askDelete} />
            )}

            {/* ---------------- DRAG & DROP QUESTIONS ---------------- */}
            {dragTasks.length > 0 && (
              <ExamDragDropRender type="Drag & Drop Questions" tasks={dragTasks} onEdit={openEditDialog} onDelete={askDelete} />
            )}

            {/* ---------------- MATCHING QUESTIONS ---------------- */}
            {matchingTasks.length > 0 && (
              <ExamMatchingRender type="Matching Questions" tasks={matchingTasks} onEdit={openEditDialog} onDelete={askDelete} />
            )}
            {/* ---------------- PARAGRAPH DRAG ---------------- */}
            {paragraphDragTasks.length > 0 && (
              <ExamParagraphRender type="Paragraph (Dropdown Blanks)" tasks={paragraphDragTasks} onEdit={openEditDialog} onDelete={askDelete} />
            )}
          </TabsContent>
        );
      })}
      </Tabs>

      {/* Edit Dialog*/}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger />
        <DialogContent className="w-[85vw] max-w-none max-h-[95vh] overflow-y-auto p-6" onCloseAutoFocus={(e) => e.preventDefault()} onOpenAutoFocus={(e) => e.preventDefault()}>
          {editingTask && (
            <>
              <DialogTitle>Edit Task</DialogTitle>
              <UpdateExam
                initial={{
                  task_type: editingTask.task_type,
                  points: editingTask.points,
                  question: editingTask.question,
                  course_id: editingTask.course_id,
                  exam_type: editingTask.exam_type,
                  exam_section: editingTask.exam_section,
                  extra_data: mapTaskToBuilderInitial(editingTask),
                }}
                refetch={refetch}
                onClose={() => setEditOpen(false)}
                examId={editingTask.id}
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
