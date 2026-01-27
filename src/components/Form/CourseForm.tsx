import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { createCourse, updateCourse } from '@/services/courseService';
import { listCategories } from '@/services/categoryService';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { CoursePayloadType, CourseType } from '@/types/course';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../ImageUploader';

interface CourseFormProps {
  editingItem?: CourseType | null;
}

export function CourseForm({ editingItem = null }: CourseFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const defaultForm: CoursePayloadType = {
    title: '',
    description: '',
    image: null,
    category_id: '',
    status: '1',
    price: '',
  };
  const [form, setForm] = useState<CoursePayloadType>(defaultForm);

  const { data: categories = [], isLoading: categoryLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!editingItem) return;
    setForm({
      title: editingItem.title ?? '',
      description: editingItem.description ?? '',
      image: editingItem?.image ?? null,
      banner: editingItem?.banner ?? null,
      status: editingItem?.status ?? '1',
      price: editingItem?.price ?? '',
      category_id: String(editingItem?.category?.id ?? ''),
    });
  }, [editingItem]);

  const handleCancel = () => {
    navigate('/teacher/courses');
  };

  const createMutation = useMutation({
    mutationFn: (payload: FormData) => createCourse(payload),
    onSuccess: async () => {
      toast.success('Course created successfully');
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      handleCancel();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create course!'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) => updateCourse(id, payload),
    onSuccess: async () => {
      toast.success('Course updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      if (editingItem && editingItem.id) {
        await queryClient.invalidateQueries({ queryKey: ['course', editingItem.id] });
      }
      handleCancel();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update course!'),
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    const fileFields = ['image', 'banner'];

    Object.entries(form).forEach(([key, value]) => {
      if (value == null) return;

      if (fileFields.includes(key) && value instanceof File) {
        payload.append(key, value);
      } else if (!fileFields.includes(key)) {
        payload.append(key, value as any);
      }
    });

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || categoryLoading;

  return (
    <form onSubmit={onSubmit} className="px-6 py-4 md:px-8 ">
      {/* <CardTitle className="text-lg font-semibold flex items-center mb-6 gap-2">
        <div className="h-8 w-1 bg-primary rounded-full" />
        {editingItem ? 'Edit Course' : 'Create Course'}
    </CardTitle> */}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4   gap-7`}>
        <div className={`space-y-2 col-span-2   ${editingItem && 'md:col-span-1'}   lg:col-span-2   `}>
          <Label htmlFor="title" className="text-sm font-medium">
            Course Title <span className="text-destructive">*</span>
          </Label>
          <Input id="title" placeholder="e.g. IELTS" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required className="h-10.5" />
        </div>

        {!editingItem && (
          <div className=" col-span-2 md:col-span-1 space-y-2">
            <Label htmlFor="category_id" className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={String(form.category_id || '')} onValueChange={(value) => handleChange('category_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className={`space-y-2 col-span-2   md:col-span-1 ${editingItem ? 'lg:col-span-2' : 'lg:col-span-1'} `}>
          <Label htmlFor="price" className="text-sm font-medium">
            Fee
          </Label>
          <div className="relative">
            <Input id="price" type="number" min="0" step="1" placeholder="eg.1000" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} required className="h-10.5" />
          </div>
        </div>

        <div className="space-y-2 col-span-2 md:col-span-2 lg:col-span-4">
          <Label htmlFor="description">
            Course Description <span className="text-destructive">*</span>
          </Label>
          <div className="rounded-xl border bg-transparent border-gray-50 focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
            <ReactQuill
              theme="snow"
              className="rounded-xl min-h-[150px] [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-container]:min-h-[140px]"
              value={form.description || ''}
              onChange={(value: string) => handleChange('description', value)}
              placeholder="Write your course content here..."
            />
          </div>
        </div>

        <ImageUploader label="Cover Image" value={form?.image || null} onChange={(file) => setForm((prev) => ({ ...prev, image: file }))} />
        <ImageUploader label="Banner Image" value={form.banner || null} onChange={(file) => setForm((prev) => ({ ...prev, banner: file }))} />
      </div>

      <div className="flex items-center gap-3 justify-end mt-8 pt-6 border-t">
        <Button variant="outline" type="button" onClick={handleCancel} disabled={isLoading} className="min-w-24">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-32 rounded-md">
          {isLoading ? <Spinner className="mr-2" /> : editingItem ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}
