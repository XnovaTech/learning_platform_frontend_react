import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LessonTaskQuill } from '@/components/ui/lesson-task-quill';
import { uploadParagraphImage } from '@/services/courseExamParagraphService';
import { createCourseExamParagraph, deleteCourseExamParagraph, updateCourseExamParagraph } from '@/services/courseExamParagraphService';
import type { CourseExamParagraphType, CourseExamParagraphPayloadType } from '@/types/courseexamparagraph';
import { ConfirmDialog } from '../ui/dialog-context-menu';

interface ExamParagraphListProps {
  sectionId: number;
  paragraphs?: CourseExamParagraphType[];
  refetch: () => void;
}

export function ExamParagraphList({ sectionId, paragraphs,refetch }: ExamParagraphListProps) {
  const queryClient = useQueryClient();
  
  // State for form
  const [paragraphContent, setParagraphContent] = useState('');
  const [editingParagraph, setEditingParagraph] = useState<CourseExamParagraphType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCourseExamParagraph,
    onSuccess: async () => {
      toast.success('Paragraph created successfully');
      setParagraphContent('');
      setIsDialogOpen(false);
      refetch();
      await queryClient.invalidateQueries({ queryKey: ['courseExamParagraphs', sectionId] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create paragraph!'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CourseExamParagraphPayloadType }) => updateCourseExamParagraph(id, payload),
    onSuccess: async () => {
      toast.success('Paragraph updated successfully');
      setEditingParagraph(null);
      setIsDialogOpen(false);
      refetch();
      await queryClient.invalidateQueries({ queryKey: ['courseExamParagraphs', sectionId] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update paragraph!'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourseExamParagraph,
    onSuccess: async () => {
      toast.success('Paragraph deleted successfully');
      setDeletingId(null);
      setIsDeleteDialogOpen(false);
      refetch();
      await queryClient.invalidateQueries({ queryKey: ['courseExamParagraphs', sectionId] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete paragraph!'),
  });

  // Handlers
  const handleCreate = () => {
    setEditingParagraph(null);
    setParagraphContent('');
    setIsDialogOpen(true);
  };

  const handleEdit = (paragraph: CourseExamParagraphType) => {
    setEditingParagraph(paragraph);
    setParagraphContent(paragraph.content);
    setIsDialogOpen(true);
  };

  const handleDelete = (paragraphId: number) => {
    setDeletingId(paragraphId);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paragraphContent.trim()) {
      toast.error('Please enter paragraph content');
      return;
    }

    const payload: CourseExamParagraphPayloadType = {
      section_id: sectionId,
      content: paragraphContent,
    };

    if (editingParagraph) {
      await updateMutation.mutateAsync({ id: editingParagraph.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };


  const isLoadingForm = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Paragraphs</h2>
          <p className="text-sm text-muted-foreground">
            Manage paragraphs for this exam section
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
              + Create Paragraph
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingParagraph ? 'Edit Paragraph' : 'Create New Paragraph'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paragraphContent">
                  Paragraph Content <span className="text-destructive">*</span>
                </Label>
                <div className="rounded-xl border bg-transparent border-gray-50 focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
                  <LessonTaskQuill 
                    value={paragraphContent} 
                    onChange={setParagraphContent} 
                    uploadFn={uploadParagraphImage} 
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoadingForm}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoadingForm}
                >
                  {isLoadingForm ? 'Saving...' : editingParagraph ? 'Update Paragraph' : 'Create Paragraph'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Paragraphs List */}
      <div className="grid gap-4">
        { paragraphs?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No paragraphs found. Create your first paragraph to get started.
          </div>
        ) : (
          paragraphs?.map((paragraph, index) => (
            <Card key={paragraph.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  Paragraph {index + 1}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(paragraph)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(paragraph.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: paragraph.content }}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
            <ConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              title="Delete Paragraphs?"
              description="This action cannot be undone. The class will be permanently removed."
              confirmText="Delete"
              cancelText="Cancel"
              loading={deleteMutation.isPending}
              destructive
              onCancel={() => {
                setIsDeleteDialogOpen(false);
                setDeletingId(null);
              }}
              onConfirm={() => {
                if (deletingId != null) deleteMutation.mutate(deletingId);
              }}
            />
    </div>
  );
}