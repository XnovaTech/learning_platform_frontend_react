import React  from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { createCourseExamSection, updateCourseExamSection } from '@/services/courseExamSectionService';
import type { CourseExamSectionType, CourseExamSectionPayload } from '@/types/courseexamsection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { examSections } from '@/mocks/exam';

interface CourseExamSectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: CourseExamSectionType | null;
  form: CourseExamSectionPayload;
  setForm: React.Dispatch<React.SetStateAction<CourseExamSectionPayload>>;
  onSuccess: () => void;
}

export function CourseExamSectionForm({ open, onOpenChange, editingItem, form, setForm, onSuccess }: CourseExamSectionFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CourseExamSectionPayload) => createCourseExamSection(payload),
    onSuccess: async () => {
      toast.success('Section created successfully');
      await queryClient.invalidateQueries({ queryKey: ['courseExam'] });
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create section!'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CourseExamSectionPayload }) => updateCourseExamSection(id, payload),
    onSuccess: async () => {
      toast.success('Section updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['courseExam'] });
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update section!'),
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl max-w-3xl">
        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          <DialogTitle className="text-lg font-semibold mb-7">{editingItem ? 'Edit Section' : 'Create Section'}</DialogTitle>
          <div className="grid grid-cols-2 gap-5">
           <div className="space-y-2 ">
             <Label className="font-medium mb-2">Exam Section</Label>
            <Select value={form.section_name} onValueChange={(value) => setForm({ ...form, section_name: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select exam section" />
              </SelectTrigger>
              <SelectContent>
                {examSections.map((section) => (
                  <SelectItem defaultValue={0} key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
           </div>
            <div className="space-y-2">
              <Label htmlFor="duration">
               Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tit,e"
                type="string"
           
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter Title"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="duration">
                Duration (minutes) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={form.duration || ''}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) || 0 })}
                placeholder="Enter duration"
                required
              />
            </div>

          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button className="rounded-md" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner className="mr-2" /> : editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
