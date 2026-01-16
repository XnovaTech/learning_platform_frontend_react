import CourseExamList from '@/components/Exams/CourseExamList';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ListCourseExamWithType } from '@/services/courseExamService';
import type { CourseExamType } from '@/types/task';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Users, BookOpen, Home, Book, BookOpenCheck } from 'lucide-react';
import CreateCourseExam from '@/components/Exams/CreateCourseExam';

export default function CourseExamPage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const examType = String(params.examType);

  const {
    data: exams,
    isLoading,
    refetch,
  } = useQuery<CourseExamType[]>({
    queryKey: ['exams', examType],
    queryFn: () => ListCourseExamWithType(courseId, examType),
    enabled: !Number.isNaN(courseId),
  });

  return (
    <div className="max-w-9xl p-4 mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2 " to="/teacher/dashboard">
                <Home className="size-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2 " to="/teacher/courses">
                <BookOpen className="size-4" />
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/${courseId}`}>
                <Book className="size-4" />
                Course Detail
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md gap-2">
              <BookOpenCheck className="size-4" />
              {examType} Exam
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur overflow-hidden">
        <Tabs defaultValue="list" className="w-full">
          <div className="border-b bg-linear-to-r from-slate-50 to-slate-100/50 px-6 py-5 flex items-center justify-between">
            <TabsList className="rounded-2xl bg-white shadow h-11">
              <TabsTrigger value="list" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <Users className="size-4" />
                <span className="font-medium">Question Lists</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <BookOpen className="size-4" />
                <span className="font-medium">Create Question</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="p-6 space-y-6 mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-14">
                <Spinner className="text-primary size-7 md:size-8" />
              </div>
            ) : (
              <CourseExamList exams={exams || []} refetch={refetch} examType={examType} />
            )}
          </TabsContent>

          <TabsContent value="create" className="p-6 space-y-6 mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Create New Question</h3>
                <p className="text-sm text-muted-foreground mt-1">Add a new question to the {examType.toLowerCase()} exam</p>
              </div>
            </div>

            <CreateCourseExam courseId={courseId} examType={examType} refetch={refetch} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
