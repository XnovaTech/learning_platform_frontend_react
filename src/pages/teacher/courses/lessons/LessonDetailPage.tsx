import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Spinner } from '@/components/ui/spinner';
import { lessonDetail } from '@/services/lessonService';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Home, BookOpen, Book } from 'lucide-react';
import TaskBuilderManager from '@/components/LessonTask/TaskManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskList from '@/components/LessonTask/TaskList';
import type { LessonType } from '@/types/lesson';
import { Card } from '@/components/ui/card';
import LessonCard from '@/components/Card/LessonCard';

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = Number(params.lessonId);

  const {
    data: lesson,
    isLoading,
    refetch,
  } = useQuery<LessonType>({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonDetail(lessonId),
    enabled: !Number.isNaN(lessonId),
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
    <div className="max-w-9xl p-4 mx-auto space-y-6">
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
              <Link className="text-base md:text-md gap-2" to="/teacher/courses" prefetch="intent">
                <BookOpen className="size-4" />
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/${lesson?.course_id}`} prefetch="intent">
                <Book className="size-4" />
                Course Detail
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md gap-2">
              <BookOpen className="size-4" />
              {lesson?.title ?? 'Detail'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <LessonCard lesson={lesson} />

      <Card className="border-0 shadow-xl mt-0 pt-0 bg-white/80 backdrop-blur overflow-hidden">
        <Tabs defaultValue="taskList" className="w-full">
          <div className="border-b bg-linear-to-r from-slate-50 to-slate-100/50 px-6 py-5 flex items-center justify-between">
            <TabsList className=" rounded-2xl bg-white  shadow  h-11">
              <TabsTrigger value="taskList" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <span className="font-medium">Task Lists</span>
              </TabsTrigger>
              <TabsTrigger value="createTask" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <span className="font-medium">Create Tasks</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="taskList" className="p-6 space-y-6 mt-0">
            <TaskList tasks={lesson?.tasks} refetch={refetch} />
          </TabsContent>

          <TabsContent value="createTask" className="p-6 space-y-6 mt-0">
            <TaskBuilderManager lessonId={lesson?.id} refetch={refetch} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
