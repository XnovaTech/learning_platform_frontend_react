import React, { useEffect } from 'react';
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
import { Upload, X, ImageIcon } from 'lucide-react';
import type { CourseType } from '@/types/course';
import { useNavigate } from 'react-router-dom';
import { CardTitle } from '../ui/card';

interface CourseFormProps {
  editingItem?: CourseType | null;
  form: CourseFormState;
  setForm: React.Dispatch<React.SetStateAction<CourseFormState>>;
}

export type CourseFormState = {
  title: string;
  description?: string;
  status: number | string;
  image?: File | string | null;
  price?: number | string;
  category_id?: number | string;
};

export function CourseForm({ editingItem = null, form, setForm }: CourseFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({
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
      status: editingItem?.status ?? '1',
      price: editingItem?.price ?? '',
      category_id: editingItem?.category_id ?? '',
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
      handleCancel();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update course!'),
  });

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [id]: files[0] }));
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (key === 'image') {
        if (value instanceof File) {
          payload.append('image', value);
        }
        return;
      }
      payload.append(key, value as any);
    });

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={onSubmit} className="p-6 md:p-8">
      <CardTitle className="text-lg font-semibold flex items-center mb-6 gap-2">
        <div className="h-8 w-1 bg-primary rounded-full" />
        {editingItem ? 'Edit Course' : 'Create Course'}
      </CardTitle>

      <div className="grid grid-cols-1   lg:grid-cols-3 gap-8">
        <div className={`space-y-2 ${editingItem && "col-span-3"} `}>
          <Label htmlFor="title" className="text-sm font-medium">
            Course Title <span className="text-destructive">*</span>
          </Label>
          <Input id="title" placeholder="e.g. IELTS" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required className="h-11" />
        </div>

        {!editingItem && (
          <div className="space-y-2">
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

        <div className={`space-y-2 ${editingItem && "col-span-3"} `}>
          <Label htmlFor="price" className="text-sm font-medium">
            Fee
          </Label>
          <div className="relative">
            <Input id="price" type="number" min="0" step="1" placeholder="eg.1000" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} required className="h-11 pl-7" />
          </div>
        </div>

        <div className="space-y-2 lg:col-span-3">
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

        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              Cover Image
            </h3>

            <div className="space-y-3">
              {form.image ? (
                <div className="relative group">
                  <div className="w-full overflow-hidden rounded-lg border-2 border-primary/20 bg-muted/20">
                    <img src={form.image instanceof File ? URL.createObjectURL(form.image) : form.image} alt="Course cover preview" className="w-full h-56 object-cover" />
                  </div>
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="w-full h-56 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer bg-muted/10 hover:bg-muted/20 group"
                >
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50 group-hover:text-primary/70 transition-colors mb-3" />
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </label>
              )}
              <Input id="image" type="file" accept="image/*" onChange={handleImgChange} className="hidden" />

              {!form.image && (
                <Button type="button" className="w-full" onClick={() => document.getElementById('image')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              )}
            </div>
          </div>
        </div>
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
