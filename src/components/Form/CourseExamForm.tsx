import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { createCourseExamEntity, updateCourseExamEntity } from '@/services/courseExamService';
import { LessonTaskQuill } from '@/components/ui/lesson-task-quill';
import { uploadImage } from '@/services/courseExamService';
import type { CourseExamType, CourseExamPayload } from '@/types/courseexam';
import { DialogTitle } from '@radix-ui/react-dialog';

interface CourseExamFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: CourseExamType | null;
  courseId: number;
  examType: string;
  form: CourseExamPayload;
  setForm: React.Dispatch<React.SetStateAction<CourseExamPayload>>;
  onSuccess: () => void;
  isModal?: boolean;
  refetch?: () => void;
}

export function CourseExamForm({ open, onOpenChange, editingItem, courseId, examType, form, setForm, onSuccess, isModal = true, refetch }: CourseExamFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CourseExamPayload) => createCourseExamEntity(payload),
    onSuccess: async () => {
      toast.success('Exam created successfully');
      await queryClient.invalidateQueries({ queryKey: ['courseExam', courseId, examType] });
      refetch?.();
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create exam!'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CourseExamPayload }) => updateCourseExamEntity(id, payload),
    onSuccess: async () => {
      toast.success('Exam updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['courseExam', courseId, examType] });
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update exam!'),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload: form });
    } else {
      await createMutation.mutateAsync(form);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const formContent = (
    <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
      {editingItem && <DialogTitle className="text-lg font-semibold mb-7">Edit Exam</DialogTitle>}
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-2">
          <Label htmlFor="total_duration">
            Total Duration (minutes) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="total_duration"
            type="number"
            min="0"
            value={form.total_duration ?? ''}
            onChange={(e) => setForm({ ...form, total_duration: Number(e.target.value) || 0 })}
            placeholder="Enter duration in minutes"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="intro">Introduction</Label>
          <LessonTaskQuill value={form.intro || ''} onChange={(value) => setForm({ ...form, intro: value })} uploadFn={uploadImage} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-4">
        {isModal && (
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button className="rounded-md" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner className="mr-2" /> : editingItem ? 'Update Exam' : 'Create Exam'}
        </Button>
      </div>
    </form>
  );

  return isModal ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl max-w-3xl">
        <DialogTitle className="text-lg font-semibold mb-7">{editingItem ? 'Edit Exam' : 'Create Exam'}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  ) : (
    <div className="space-y-6">
      {formContent}
    </div>
  );
}
