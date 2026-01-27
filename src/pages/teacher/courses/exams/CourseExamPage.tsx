import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ListCourseExamWithType } from '@/services/courseExamService';
import type { CourseExamType, ExamType } from '@/types/courseexam';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Home, Book, BookOpenCheck, BadgeQuestionMark } from 'lucide-react';
import CourseExamList from '@/components/Exams/CourseExamList';
import CourseExamQuestionAllList from '@/components/Exams/CourseExamQuestionAllList';

export default function CourseExamPage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const examType = params.examType as unknown as ExamType;

  const {
    data: courseExam,
    isLoading,
    refetch,
  } = useQuery<CourseExamType>({
    queryKey: ['courseExam', courseId, examType],
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
        <Tabs defaultValue="exams" className="w-full">
          <div className="border-b bg-linear-to-r from-slate-50 to-slate-100/50 px-6 pb-2 pt-0  flex items-center justify-between">
            <TabsList className="rounded-2xl bg-white shadow h-11">
              <TabsTrigger value="exams" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <BookOpenCheck className="size-4" />
                <span className="font-medium">{examType} Exams</span>
              </TabsTrigger>

              <TabsTrigger value="questions" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
                <BadgeQuestionMark className="size-4" />
                <span className="font-medium"> All Questions</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="exams" className="p-6 space-y-6 mt-0">
            <CourseExamList exam={courseExam || null} isLoading={isLoading} courseId={courseId} examType={examType} />
          </TabsContent>

          <TabsContent value="questions" className="p-6 space-y-6 mt-0">
            <CourseExamQuestionAllList sections={courseExam?.sections || []} refetch={refetch} courseId={courseId} examType={examType} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
