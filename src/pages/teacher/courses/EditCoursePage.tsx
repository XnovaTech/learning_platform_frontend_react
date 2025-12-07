import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { getCourse } from '@/services/courseService';
import { Spinner } from '@/components/ui/spinner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { CourseForm, type CourseFormState } from '@/components/Form/CourseForm';

export default function EditCoursePage() {
  const params = useParams();
  const courseId = Number(params.courseId);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !Number.isNaN(courseId),
  });

  const [form, setForm] = useState<CourseFormState>({
    title: '',
    description: '',
    image: null,
    status: '1',
    price: '',
    category_id: course?.category?.id || '',
  });

  if (isLoading) {
    return (
      <div className="max-w-8xl p-4 mx-auto space-y-6">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur p-6">
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-8xl p-4 mx-auto space-y-6">
      {/* Breadcrumbs */}
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
            <BreadcrumbPage className="text-base md:text-md">Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur transition-all duration-300 ease-in-out">
        <CourseForm editingItem={course || null} form={form} setForm={setForm} />
      </Card>
    </div>
  );
}
