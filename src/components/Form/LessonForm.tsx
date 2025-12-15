import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { createLesson, updateLesson, uploadLessonDescriptionImage } from '@/services/lessonService';
import type { LessonPayloadType, LessonType } from '@/types/lesson';
import { useNavigate } from 'react-router-dom';
import { CardTitle } from '../ui/card';

interface LessonFormProps {
  editingItem?: LessonType | null;
  courseId?: number;
}

export function LessonForm({ editingItem = null, courseId }: LessonFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const quillRef = useRef<any>(null);

  const defaultForm: LessonPayloadType = {
    course_id: courseId,
    title: null,
    description: null,
    youtube_link: null,
  };
  
  //upload desc image
  const imageHandler = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      if (!input.files?.[0]) return;

      const formData = new FormData();
      formData.append('image', input.files[0]);

      const res = await uploadLessonDescriptionImage(formData);

      const editor = quillRef.current?.getEditor();

      if (!editor) return;

      const range = editor?.getSelection();

      console.log('response data is', res.url)
        editor.insertEmbed(range.index,'image', res.url);
        editor.setSelection(range.index + 1);

        console.log("data is", editor.root.innerHTML);
    };
  };

  // quill modules
  const quillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers:{
        image: imageHandler,
      }
    }
  }

  const quillFormats = [
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'image'
  ]

  const [form, setForm] = useState<LessonPayloadType>(defaultForm);

  useEffect(() => {
    if (!editingItem) return;
    setForm({
      course_id: editingItem.course_id,
      title: editingItem.title ?? '',
      description: editingItem.description,
      youtube_link: editingItem.youtube_link,
    });
  }, [editingItem]);

  const handleCancel = () => {
    navigate(`/teacher/courses/${courseId}`);
  };

  const createMutation = useMutation({
    mutationFn: (payload: LessonPayloadType) => createLesson(payload),
    onSuccess: async () => {
      toast.success('Lesson created successfully');
      await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      handleCancel();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create lesson!'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: LessonPayloadType }) => updateLesson(id, payload),
    onSuccess: async () => {
      toast.success('Lesson updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['course', editingItem?.course_id] });
      handleCancel();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update lesson!'),
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
            <ReactQuill
              ref={quillRef}
              theme="snow"
              formats={quillFormats}
              modules={quillModules}
              className="rounded-xl min-h-[180px] [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-container]:min-h-40"
              value={form.description || ''}
              onChange={(value: string) => setForm({ ...form, description: value })}
              placeholder="Write your lesson content here..."
            />
          </div>
        </div>
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
