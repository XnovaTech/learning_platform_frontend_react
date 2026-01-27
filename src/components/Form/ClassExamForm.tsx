import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createClassRoomExam, updateClassRoomExam } from '@/services/classExamService';
import type { ClassRoomExamPayloadType, ClassRoomExamType } from '@/types/classexam';

const examTypes = ['Midterm', 'Final'];

interface ClassExamFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: ClassRoomExamType | null;
  classId: number;
  form: ClassRoomExamPayloadType;
  setForm: React.Dispatch<React.SetStateAction<ClassRoomExamPayloadType>>;
  onSuccess: () => void;
}

export function ClassExamForm({ open, onOpenChange, editingItem, classId, form, setForm, onSuccess }: ClassExamFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: ClassRoomExamPayloadType) => createClassRoomExam(payload),
    onSuccess: async () => {
      toast.success('Exam created successfully');
      await queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Fail to create exam record !'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ClassRoomExamPayloadType }) => updateClassRoomExam(id, payload),
    onSuccess: async () => {
      toast.success('Exam updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update exam!'),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, class_id: classId };

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          <DialogTitle className="text-lg font-semibold mb-4">{editingItem ? 'Edit Exam' : 'Create Exam'}</DialogTitle>
          {!editingItem && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-4">
              <p className="text-yellow-700 text-sm tracking-normal text-center ">** Each exam type (Midterm or Final) can only be created once per class. **</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="exam_type">
                Exam Type <span className="text-destructive">*</span>
              </Label>
              <Select disabled={!!editingItem} value={form.exam_type || ''} onValueChange={(v) => setForm({ ...form, exam_type: v })}>
                <SelectTrigger id="exam_type">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input id="start_date" required type="date" autoComplete="off" value={form.start_date || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input id="end_date" required type="date" autoComplete="off" value={form.end_date || ''} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
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
