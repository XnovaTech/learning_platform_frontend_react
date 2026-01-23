import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { getCourseExamQuestion } from '@/services/courseExamQuestionService';
import { Spinner } from '@/components/ui/spinner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Book, BookOpen, BookOpenCheck, BadgeQuestionMark } from 'lucide-react';
import CourseExamQuestionTabs from '@/components/Exams/CourseExamQuestionTabs';

export default function EditCourseExamQuestionPage() {
  const { courseId, examType, questionId: questionIdParam } = useParams();
  const questionId = Number(questionIdParam);

  const { data: question, isLoading } = useQuery({
    queryKey: ['courseExamQuestion', questionId],
    queryFn: () => getCourseExamQuestion(questionId),
    enabled: !Number.isNaN(questionId),
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
              <Link className="text-base md:text-md  gap-2" to="/teacher/courses">
                <BookOpen className="size-4" />
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md  gap-2" to={`/teacher/courses/${courseId}`}>
                <Book className="size-4" />
                Course Detail
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md  gap-2" to={`/teacher/courses/${courseId}/exams/${examType}`}>
                <BookOpenCheck className="size-4" />
                Exam
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md  gap-2">
              <BadgeQuestionMark className="size-4" />
              Edit Question
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur transition-all duration-300 ease-in-out">
        <CourseExamQuestionTabs
          courseId={Number(courseId)}
          examType={examType!}
          editingItem={question}
        />
      </Card>
    </div>
  );
}
