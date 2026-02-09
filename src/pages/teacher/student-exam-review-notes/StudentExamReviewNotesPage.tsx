import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { listStudentExamReviewNotes, deleteStudentExamReviewNote } from '@/services/studentExamReviewNoteService';
import type { StudentExamReviewNote } from '@/types/studentexamreviewnote';
import { Edit, Plus, Tag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/ui/dialog-context-menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import StudentExamReviewNoteForm from '@/components/Form/StudentExamReviewNoteForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function StudentExamReviewNotesPage() {
  const [editingItem, setEditingItem] = useState<StudentExamReviewNote | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['review-notes'],
    queryFn: listStudentExamReviewNotes,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteStudentExamReviewNote(id),
    onSuccess: async () => {
      toast.success('Review note deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['review-notes'] });
      setConfirmOpen(false);
      setDeletingId(null);
    },
    onError: (e) => {
      toast.error(e?.message || 'Failed to delete review note!');
    },
  });

  const startEdit = (note: StudentExamReviewNote) => {
    setEditingItem(note);
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
          <h2 className="text-2xl font-semibold tracking-tight">Student Exam Review Notes</h2>
          <p className="text-muted-foreground text-sm">Manage student exam review notes.</p>
        </div>
        <Button
          type="button"
          className="gap-2"
          onClick={() => {
            setEditingItem(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" /> Create Review Note
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Review Notes List</h3>
        </div>
        <div className="divide-y">
          {isLoading && (
            <div className="flex items-center justify-center py-14">
              <Spinner className="text-primary size-7 md:size-8" />
            </div>
          )}
          {notes.length === 0 && !isLoading && !isError && (
            <div className="flex flex-col items-center justify-center py-14 px-4">
              <div className="rounded-full bg-primary/90 p-4 mb-4">
                <Tag className="size-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-1">No Review Notes Found</h4>
              <p className="text-sm text-muted-foreground mb-4">Create your first review note</p>
            </div>
          )}
          {!isLoading &&
            notes?.map((note) => (
              <div key={note.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{note.title}</div>
                  <div className="text-sm text-gray-600">{note.note}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="primary" className="cursor-pointer" onClick={() => startEdit(note)}>
                    <Edit className="transition-all duration-300 ease-in-out size" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="cursor-pointer" onClick={() => askDelete(note.id)}>
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
        title="Delete review note?"
        description="This action cannot be undone. The review note will be permanently removed."
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
          <StudentExamReviewNoteForm editingItem={editingItem} setFormOpen={setFormOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}