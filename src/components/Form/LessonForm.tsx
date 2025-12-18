import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { createLesson, updateLesson, uploadLessonDescriptionImage } from '@/services/lessonService';
import { deleteLessonDocument, uploadLessonDocument } from '@/services/lessonDocumentService';
import type { LessonPayloadType, LessonType } from '@/types/lesson';
import type { LessonDocumentType } from '@/types/lessondocument';
import { useNavigate } from 'react-router-dom';
import { CardTitle } from '../ui/card';
import { LessonQuill } from '../ui/lesson-quill';
import FileUploader from '../FileUploader';

interface LessonFormProps {
  editingItem?: LessonType | null;
  courseId?: number;
}

export function LessonForm({ editingItem = null, courseId }: LessonFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const defaultForm: LessonPayloadType = {
    course_id: courseId,
    title: null,
    description: null,
    youtube_link: null,
    documents: [],
  };

  const [form, setForm] = useState<LessonPayloadType>(defaultForm);
  const [existingDocuments, setExistingDocuments] = useState<LessonDocumentType[]>([]);

  useEffect(() => {
    if (!editingItem) return;
    setForm({
      course_id: editingItem.course_id,
      title: editingItem.title ?? '',
      description: editingItem.description,
      youtube_link: editingItem.youtube_link,
      documents: [],
    });
    setExistingDocuments(editingItem.documents || []);
  }, [editingItem]);

  const deleteDocumentMutation = useMutation({
    mutationFn: (id: number) => deleteLessonDocument(id),
    onSuccess: async () => {
      toast.success('Lesson Document deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['lesson', editingItem?.id] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete lesson document!'),
  });

  const handleRemoveExisting = async (docId: number) => {
    deleteDocumentMutation.mutate(docId);
    setExistingDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleCancel = () => {
    navigate(`/teacher/courses/${courseId}`);
  };

  const createMutation = useMutation({
    mutationFn: (payload: any) => createLesson(payload),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateLesson(id, payload),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { documents, ...payload } = form;

    try {
      let lesson;
      if (editingItem) {
        lesson = await updateMutation.mutateAsync({ id: editingItem.id, payload });
      } else {
        lesson = await createMutation.mutateAsync(payload);
      }

      const lessonId = editingItem ? editingItem.id : lesson.id;
      if (documents.length) {
        await Promise.all(
          documents.map((file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('lesson_id', lessonId.toString());
            return uploadLessonDocument(formData);
          })
        );
        toast.success('Lesson documents uploaded successfully');
      }

      toast.success(editingItem ? 'Lesson updated successfully' : 'Lesson created successfully');

      await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      handleCancel();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save lesson and documents');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={onSubmit} className=" p-6 ">
      <CardTitle className="text-lg font-semibold flex items-center  mb-6 gap-2">
        <div className="h-8 w-1 bg-primary rounded-full" />
        {editingItem ? 'Edit Lesson' : 'Create Lesson'}{' '}
      </CardTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-4">
        <div className=" space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input id="title" type="text" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter lesson title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube_link">
            YouTube Link <span className="text-destructive">*</span>
          </Label>
          <Input id="youtube_link" type="url" value={form.youtube_link || ''} onChange={(e) => setForm({ ...form, youtube_link: e.target.value })} placeholder="https://youtube.com/..." />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <div className="rounded-xl border  bg-transparent border-gray-50 focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
            <LessonQuill form={form} setForm={setForm} uploadFn={uploadLessonDescriptionImage} />
          </div>
        </div>

        <FileUploader
          label="Documents"
          existing={existingDocuments}
          newFiles={form.documents}
          onRemoveExisting={handleRemoveExisting}
          onChangeNew={(files) => setForm({ ...form, documents: files })}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button className="rounded-md" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner className="mr-2" /> : editingItem ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
