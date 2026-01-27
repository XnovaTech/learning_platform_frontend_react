import type { CourseExamQuestionType } from '@/types/courseexamquestion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../ui/dialog-context-menu';
import ExamLongRender from '../Teacher/ExamRender/ExamLongRender';
import ExamShortRender from '../Teacher/ExamRender/ExamShortRender';
import ExamMCQRender from '../Teacher/ExamRender/ExamMCQRender';
import ExamDragDropRender from '../Teacher/ExamRender/ExamDragDropRender';
import ExamMatchingRender from '../Teacher/ExamRender/ExamMatchingRender';
import ExamParagraphRender from '../Teacher/ExamRender/ExamParagraphRender';
import ExamTableDragRender from '../Teacher/ExamRender/ExamTableDragRender';
import ExamCharacterWebRender from '../Teacher/ExamRender/ExamCharacterWebRender';
import { deleteCourseExamQuestion } from '@/services/courseExamQuestionService';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

type Props = {
  questions: CourseExamQuestionType[];
  refetch: () => void;
  courseId: number;
  examType: string;
};

export default function SectionQuestionList({ questions, refetch, courseId, examType }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCourseExamQuestion(id),
    onSuccess: async () => {
      toast.success('Question deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['courseExam'] });
      setConfirmOpen(false);
      setDeletingId(null);
      refetch();
    },
    onError: (error: any) => toast.error(error?.message || 'Failed to delete question'),
  });

  const askDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleEdit = (task: CourseExamQuestionType) => {
    navigate(`/teacher/courses/${courseId}/exams/${examType}/questions/edit/${task.id}`);
  };

  const mcqTasks = questions.filter((q) => q.task_type === 'mcq');
  const tfTasks = questions.filter((q) => q.task_type === 'true_false');
  const shortTasks = questions.filter((q) => q.task_type === 'short');
  const longTasks = questions.filter((q) => q.task_type === 'long');
  const blankTasks = questions.filter((q) => q.task_type === 'fill_blank');
  const matchingTasks = questions.filter((q) => q.task_type === 'matching');
  const dragTasks = questions.filter((q) => q.task_type === 'drag_drop');
  const paragraphDragTasks = questions.filter((q) => q.task_type === 'paragraph_drag');
  const tableDragTasks = questions.filter((q) => q.task_type === 'table_drag');
  const characterWebTasks = questions.filter((q) => q.task_type === 'character_web');

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Questions Found</h3>
        <p className="text-sm text-muted-foreground">This section doesn't have any questions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {longTasks.length > 0 && <ExamLongRender type="Long Questions" tasks={longTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {shortTasks.length > 0 && <ExamShortRender type="Short Questions" tasks={shortTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {blankTasks.length > 0 && <ExamShortRender type="Fill in the Blanks Questions" tasks={blankTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {mcqTasks.length > 0 && <ExamMCQRender type="Multiple Choice Questions" tasks={mcqTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {tfTasks.length > 0 && <ExamMCQRender type="True / False Questions" tasks={tfTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {dragTasks.length > 0 && <ExamDragDropRender type="Drag & Drop Questions" tasks={dragTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {matchingTasks.length > 0 && <ExamMatchingRender type="Matching Questions" tasks={matchingTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {paragraphDragTasks.length > 0 && <ExamParagraphRender type="Paragraph (Dropdown Blanks)" tasks={paragraphDragTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {tableDragTasks.length > 0 && <ExamTableDragRender type="Table Drag & Drop Questions" tasks={tableDragTasks} onEdit={handleEdit} onDelete={askDelete} />}

      {characterWebTasks.length > 0 && <ExamCharacterWebRender type="Character Web Questions" tasks={characterWebTasks} onEdit={handleEdit} onDelete={askDelete} />}

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
