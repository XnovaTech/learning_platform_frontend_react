'';

import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { createCourse } from '@/services/courseService';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { listCategories } from '@/services/categoryService';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
    refetchOnWindowFocus: false,
  });

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: null,
    category_id: '',
    status: '1',
    price: '',
  });

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: async () => {
      toast.success('Course created successfully');
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      navigate('/teacher/courses');
    },
    onError: (e) => {
      toast.error(e?.message || 'Failed to create course!');
    },
  });

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [id]: files[0] }));
    }
  };

  const handleChange = (field: string | number, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
  };

  const resetForm = () =>
    setForm({
      title: '',
      description: '',
      image: null,
      category_id: '',
      status: '1',
      price: '',
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        payload.append(key, value as any);
      }
    });

    await createMutation.mutateAsync(payload);
    resetForm();
  };

  return (
    <div className="max-w-8xl p-4  mx-auto space-y-6">
      {/* Link */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md" to="/teacher/dashboard">
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md" to="/teacher/courses">
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md">Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <form onSubmit={onSubmit} className="p-6 md:p-8">
          <h3 className="text-lg font-semibold flex items-center mb-5 gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Course Title <span className="text-destructive">*</span>
              </Label>
              <Input id="title" placeholder="e.g. IELTS" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required className="h-11" />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="category_id" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={form.category_id} onValueChange={(value) => handleChange('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Fee
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="eg.1000"
                  value={form.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  required
                  className="h-11 pl-7"
                />
              </div>
            </div>

            <div className="space-y-2 lg:col-span-3">
              <Label htmlFor="description">
                Course Description <span className="text-destructive">*</span>
              </Label>
              <div className="rounded-xl border  bg-transparent border-gray-50 focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
                <ReactQuill
                  theme="snow"
                  className="rounded-xl min-h-[180px] [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-container]:min-h-[175px]"
                  value={form.description || ''}
                  onChange={(value: string) => handleChange('description', value)}
                  placeholder="Write your lesson content here..."
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
                        <img
                          src={URL.createObjectURL(form.image as any)} 
                          alt="Course cover preview" 
                          className="w-full h-56 object-cover" 
                        />
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
            <Button variant="outline" type="button" onClick={() => navigate('/teacher/courses')} disabled={createMutation.isPending} className="min-w-24">
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="min-w-32 rounded-md">
              {createMutation.isPending ? <Spinner className="mr-2" /> : 'Create Course'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
