import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { lessonDetail } from '@/services/lessonService';
import { Spinner } from '@/components/ui/spinner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import type { LessonType } from '@/types/lesson';
import { LessonForm } from '@/components/Form/LessonForm';
import { Book, BookOpen, Home, Edit } from 'lucide-react';

export default function EditLessonPage() {
  const params = useParams();
  const lessonId = Number(params.lessonId);
  const queryClient = useQueryClient();

  const preloadedLesson = queryClient.getQueryData<LessonType>(['lesson', lessonId]);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonDetail(lessonId),
    enabled: !preloadedLesson,
    initialData: preloadedLesson,
    staleTime: 60 * 1000,
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
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to="/teacher/dashboard">
                <Home className="size-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to="/teacher/courses">
                <BookOpen className="size-4" />
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/${lesson?.course_id}`}>
                <Book className="size-4" />
                Course Detail
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md gap-2">
              <Edit className="size-4" />
              Edit Lesson
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur transition-all duration-300 ease-in-out">
        <LessonForm editingItem={lesson || null} courseId={lesson?.course_id} />
      </Card>
    </div>
  );
}
