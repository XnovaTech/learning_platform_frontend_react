import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ListCourseExamWithType } from '@/services/courseExamService';
import type { CourseExamType, ExamType, CourseExamPayload } from '@/types/courseexam';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Home, Book, BookOpenCheck, Loader2, Plus, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { CourseExamForm } from '@/components/Form/CourseExamForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';



export default function CourseExamListByTypePage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const examType = params.examType as unknown as ExamType;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form, setForm] = useState<CourseExamPayload>({
    course_id: courseId,
    exam_type: examType,
    total_duration: 0,
    intro: '',
  });

  const {
    data: courseExams,
    isLoading,
    refetch
  } = useQuery<CourseExamType[]>({
    queryKey: ['courseExams', courseId, examType],
    queryFn: () => ListCourseExamWithType(courseId, examType),
    enabled: !Number.isNaN(courseId),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-80">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading {examType} exams...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" to="/teacher/dashboard">
                    <Home className="size-4 inline mr-1" />
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" to="/teacher/courses">
                    <BookOpen className="size-4 inline mr-1" />
                    Courses
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" to={`/teacher/courses/${courseId}`}>
                    <Book className="size-4 inline mr-1" />
                    Course
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium flex items-center gap-2">
                  <BookOpenCheck className="size-4" />
                  {examType} Exams
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 mt-10">
            <h1 className="text-2xl font-bold text-foreground">{examType} Exams</h1>
            <Badge variant="secondary" className="text-sm">
              {courseExams?.length || 0} exams
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage and create {examType.toLowerCase()} exams for this course
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid gap-6">
        {courseExams?.length === 0 ? (
          <Card className="border-0 shadow-lg bg-linear-to-br from-slate-50 to-white">
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                  <BookOpenCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No {examType} exams yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Get started by creating your first {examType.toLowerCase()} exam. You can add questions, set duration, and customize the exam settings.
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseExams?.map((exam, index) => (
              <Card 
                key={exam.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-white to-slate-50"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                    
                      <CardTitle className="text-lg font-semibold text-foreground">
                       {index + 1}. {exam.exam_type} Exam
                      </CardTitle>
                      {/* <CardDescription className="text-sm text-muted-foreground">
                        Duration: {exam.total_duration} minutes
                      </CardDescription> */}
                    </div>
                    <div className="bg-primary/10 rounded-full p-2">
                      <BookOpenCheck className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Exam Stats */}
                  <div className="">
                    <div className=" justify-between flex p-3 bg-white rounded-lg shadow-sm mx-1">
                      <Clock className="w-8 h-8 text-primary mt-1" />
                      <div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="font-semibold text-foreground">{exam.total_duration} min</div>
                      </div>
                    
                    </div>
                 
                  
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Link
                      to={`/teacher/courses/${courseId}/exams/${examType}/${exam.id}/detail`}
                      className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group"
                    >
                      <span className="text-sm font-medium text-primary">View Exam Details</span>
                      <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Exam Modal */}
      <CourseExamForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        editingItem={null}
        courseId={courseId}
        examType={examType}
        form={form}
        setForm={setForm}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          setForm({
            course_id: courseId,
            exam_type: examType,
            total_duration: 0,
            intro: '',
          });
          refetch?.();
        }}
        refetch={refetch}
      />
    </div>
  );
}
