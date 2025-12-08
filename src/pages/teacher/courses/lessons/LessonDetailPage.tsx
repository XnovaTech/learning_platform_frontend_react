import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { lessonDetail } from "@/services/lessonService";
import type { LessonType } from "@/types/lesson";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import TaskBuilderManager from "@/components/LessonTask/TaskManager";

export default function LessonDetailPage(){
    const params = useParams();
    const lessonId = Number(params.lessonId);
    const queryClient = useQueryClient();
    const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="max-w-9xl p-4 mx-auto space-y-6">
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
              <Link className="text-base md:text-md" to="/teacher/courses" prefetch="intent">
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md" to={`/teacher/courses/${lesson?.course_id}`} prefetch="intent">
                Course Detail
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md">{ lesson?.title ?? 'Detail'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
        
        <Card>
            <CardTitle>{lesson?.title}</CardTitle>
             <div
                  className={`text-muted-foreground min-h-32 text-base leading-relaxed transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-32'}`}
                  dangerouslySetInnerHTML={{ __html: lesson?.description || '' }}
                />
                 {lesson?.description && (
                  <Button
                    variant="link"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-primary float-right text-sm transition-all  p-0 font-medium hover:underline underline-offset-1 mt-1"
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </Button>
                )}
        </Card>

        <div>
          <TaskBuilderManager lessonId={lesson?.id}/>
        </div>
    </div>
  )
}