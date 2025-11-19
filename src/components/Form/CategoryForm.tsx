import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CategoryType } from '@/types/category';
import { toast } from 'sonner';
import { createCategory, updateCategory } from '@/services/categoryService';
import { Spinner } from '@/components/ui/spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DialogTitle } from '@/components/ui/dialog';

type Props = {
  editingItem?: CategoryType | null;
  setFormOpen: (open: boolean) => void;
};

export default function CategoryForm({ editingItem, setFormOpen }: Props) {
  const [form, setForm] = useState({ name: '', description: '' });
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      toast.success('Category created successfully');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to create category !');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name: string; description: string } }) => updateCategory(id, payload),
    onSuccess: async () => {
      toast.success('Category updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to update category !');
    },
  });

  const isEditing = !!editingItem?.id;
  const resetForm = () => setForm({ name: '', description: '' });

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name ?? '',
        description: editingItem.description ?? '',
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
          name: form.name,
          description: form.description ?? '',
        },
      });
    } else {
      await createMutation.mutateAsync({
        name: form.name,
        description: form.description ?? '',
      });
    }

    resetForm();
    setFormOpen(false);
  };

  return (
    <div>
      <DialogTitle className="font-medium  text-gray-900 mb-4">{isEditing ? 'Edit Category' : 'Create Category'}</DialogTitle>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
          <Input
            required
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. IELTS"
            disabled={createMutation.isPending || updateMutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Optional"
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
