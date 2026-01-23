import { Link, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Book, BookOpen, BookOpenCheck, BadgeQuestionMark } from 'lucide-react';
import CourseExamQuestionTabs from '@/components/Exams/CourseExamQuestionTabs';

export default function CreateCourseExamQuestionPage() {
  const { courseId, examType, sectionId: sectionIdParam } = useParams();
  const sectionId = Number(sectionIdParam);

  return (
    <div className="max-w-8xl p-4 mx-auto space-y-5">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
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
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/${courseId}`}>
                <Book  className="size-4" />
                Course Detail
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/${courseId}/exams/${examType}`}>
                <BookOpenCheck className="size-4" />
                Exam
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md gap-2">
              <BadgeQuestionMark className="size-4" />
              Create Question
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur overflow-hidden">
        <CourseExamQuestionTabs
          courseId={Number(courseId)}
          examType={examType!}
          sectionId={sectionId}
        />
      </Card>
    </div>
  );
}
