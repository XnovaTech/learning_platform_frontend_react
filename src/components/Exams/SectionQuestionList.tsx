import type { CourseExamQuestionType } from '@/types/courseexamquestion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../ui/dialog-context-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ExamLongRender from '../Teacher/ExamRender/ExamLongRender';
import ExamShortRender from '../Teacher/ExamRender/ExamShortRender';
import ExamMCQRender from '../Teacher/ExamRender/ExamMCQRender';
import ExamDragDropRender from '../Teacher/ExamRender/ExamDragDropRender';
import ExamMatchingRender from '../Teacher/ExamRender/ExamMatchingRender';
import ExamParagraphRender from '../Teacher/ExamRender/ExamParagraphRender';
import ExamTableDragRender from '../Teacher/ExamRender/ExamTableDragRender';
import ExamCharacterWebRender from '../Teacher/ExamRender/ExamCharacterWebRender';
import ExamParagraphGroupRender from '../Teacher/ExamRender/ExamParagraphGroupRender';
import { deleteCourseExamQuestion } from '@/services/courseExamQuestionService';
import { FileText } from 'lucide-react';
import { CourseExamQuestionForm } from '../Form/CourseExamQuestionForm';
import type { CourseExamParagraphType } from '@/types/courseexamparagraph';

type Props = {
  questions: CourseExamQuestionType[];
  refetch: () => void;
  paragraphs?: CourseExamParagraphType[];
  courseId: number;
  examType: string;
};

export default function SectionQuestionList({ questions, refetch, paragraphs }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<CourseExamQuestionType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Group questions by paragraph_id
  const questionsWithParagraph = questions.filter((q) => q.paragraph_id != null);
  const questionsWithoutParagraph = questions.filter((q) => q.paragraph_id == null);

  // Group questions by paragraph_id for paragraph-based rendering
  const paragraphGroups = questionsWithParagraph.reduce((acc, question) => {
    const paragraphId = question.paragraph_id!;
    if (!acc[paragraphId]) {
      acc[paragraphId] = [];
    }
    acc[paragraphId].push(question);
    return acc;
  }, {} as Record<number, CourseExamQuestionType[]>);

  // No need to fetch paragraphs separately since content is available in question.paragraph.content

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
    setEditingQuestion(task);
    setIsEditModalOpen(true);
  };

  const mcqTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'mcq');
  const tfTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'true_false');
  const shortTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'short');
  const longTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'long');
  const blankTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'fill_blank');
  const matchingTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'matching');
  const dragTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'drag_drop');
  const paragraphDragTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'paragraph_drag');
  const tableDragTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'table_drag');
  const characterWebTasks = questionsWithoutParagraph.filter((q) => q.task_type === 'character_web');

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

      {/* Render paragraph-based questions in groups */}
      {Object.entries(paragraphGroups).map(([paragraphId, questions]) => {
        // Get paragraph content from the first question's paragraph relationship
        const paragraphContent = questions[0]?.paragraph?.content || '';
        return (
          <ExamParagraphGroupRender
            key={paragraphId}
            paragraphId={Number(paragraphId)}
            paragraphContent={paragraphContent}
            questions={questions}
            onEdit={handleEdit}
            onDelete={askDelete}
          />
        );
      })}

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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="min-w-xl max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <CourseExamQuestionForm
              editingItem={editingQuestion}
              sectionId={editingQuestion.section_id}
              onClose = {() => setIsEditModalOpen(false)}
              paragraphs = {paragraphs}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
