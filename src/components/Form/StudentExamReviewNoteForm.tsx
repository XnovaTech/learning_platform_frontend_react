import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StudentExamReviewNote } from '@/types/studentexamreviewnote';
import { toast } from 'sonner';
import { createStudentExamReviewNote, updateStudentExamReviewNote } from '@/services/studentExamReviewNoteService';
import { Spinner } from '@/components/ui/spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '../ui/textarea';

type Props = {
  editingItem?: StudentExamReviewNote | null;
  setFormOpen: (open: boolean) => void;
};

export default function StudentExamReviewNoteForm({ editingItem, setFormOpen }: Props) {
  const [form, setForm] = useState({ title: '', note: '' });
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createStudentExamReviewNote,
    onSuccess: async () => {
      toast.success('Review note created successfully');
      await queryClient.invalidateQueries({ queryKey: ['review-notes'] });
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to create review note!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { title: string; note: string } }) => updateStudentExamReviewNote(id, payload),
    onSuccess: async () => {
      toast.success('Review note updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['review-notes'] });
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to update review note!');
    },
  });

  const isEditing = !!editingItem?.id;
  const resetForm = () => setForm({ title: '', note: '' });

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title ?? '',
        note: editingItem.note ?? '',
      });
    } else {
      resetForm();
    }
  }, [editingItem]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        payload: {
          title: form.title,
          note: form.note ?? '',
        },
      });
    } else {
      await createMutation.mutateAsync({
        title: form.title,
        note: form.note ?? '',
      });
    }

    resetForm();
    setFormOpen(false);
  };

  return (
    <div>
      <DialogTitle className="font-medium text-gray-900 mb-4">{isEditing ? 'Edit Review Note' : 'Create Review Note'}</DialogTitle>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
          <Input
            required
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Exam Review Notes"
            disabled={createMutation.isPending || updateMutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="note">Note <span className="text-destructive">*</span></Label>
         <Textarea id="note" rows={6} 
         value={form.note}
         onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
         disabled={createMutation.isPending || updateMutation.isPending}
         />
        
        </div>
        <div className="flex gap-2">
          <Button className="w-full rounded-md" type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? <Spinner /> : isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}