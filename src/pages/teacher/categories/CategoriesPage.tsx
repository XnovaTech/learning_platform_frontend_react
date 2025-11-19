import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { listCategories, deleteCategory } from '@/services/categoryService';
import type { CategoryType } from '@/types/category';
import {  Edit, Plus, Tag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/ui/dialog-context-menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CategoryForm from '@/components/Form/CategoryForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function CategoriesPage() {
  const [editingItem, setEditingItem] = useState<CategoryType | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: async () => {
      toast.success('Category deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      setConfirmOpen(false);
      setDeletingId(null);
    },
    onError: (e) => {
      toast.error(e?.message || 'Failed to delete category !');
    },
  });

  const startEdit = (c: CategoryType) => {
    setEditingItem(c);
    setFormOpen(true);
  };

  const askDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId == null) return;
    deleteMutation.mutate(deletingId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Categories</h2>
          <p className="text-muted-foreground text-sm">Manage and organize your courses.</p>
        </div>
        <Button
          type="button"
          className="gap-2"
          onClick={() => {
            setEditingItem(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" /> Create Category
        </Button>
      </div>

      <div className=" border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900  ">Category List</h3>
        </div>
        <div className="divide-y">
          {isLoading && (
            <div className="flex items-center justify-center py-14">
              <Spinner className="text-primary size-7 md:size-8" />
            </div>
          )}
          {categories.length === 0 && !isLoading && !isError && (
            <div className="flex flex-col items-center justify-center py-14 px-4">
              <div className="rounded-full  bg-primary/90 p-4 mb-4">
                <Tag className="size-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-1">No Categories Found</h4>
              <p className="text-sm text-muted-foreground mb-4">Create your first category</p>
            </div>
          )}
          {!isLoading &&
            categories?.map((category) => (
              <div key={category?.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{category?.name}</div>
                  {category?.description && <div className="text-sm text-gray-600">{category?.description}</div>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm"   variant="primary" className="cursor-pointer    " onClick={() => startEdit(category)}>
                    <Edit className="transition-all duration-300 ease-in-out size" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="cursor-pointer    " onClick={() => askDelete(category?.id)}>
                    <Trash2 className="transition-all duration-300 ease-in-out size" /> Delete
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete category?"
        description="This action cannot be undone. The category will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        destructive
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingId(null);
        }}
        onConfirm={confirmDelete}
      />

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingItem(null);
        }}
      >
        <DialogContent className="min-w-xl max-w-3xl">
          <CategoryForm editingItem={editingItem} setFormOpen={setFormOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
