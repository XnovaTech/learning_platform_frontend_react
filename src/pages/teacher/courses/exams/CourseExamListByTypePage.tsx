import { Card, CardContent} from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ListCourseExamWithType } from '@/services/courseExamService';
import type { CourseExamType, ExamType, CourseExamPayload } from '@/types/courseexam';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Home, Book, BookOpenCheck, Loader2, Plus, ArrowRight, Clock } from 'lucide-react';
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
    <div className="max-w-9xl p-4 mx-auto space-y-6">
      {/* Header Section */}
    
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link className="text-base md:text-md gap-2" to="/teacher/dashboard">
                    <Home className="size-4 inline mr-1" />
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link className="text-base md:text-md gap-2" to="/teacher/courses">
                    <BookOpen className="size-4 inline mr-1" />
                    Courses
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link className="text-base md:text-md gap-2" to={`/teacher/courses/${courseId}`}>
                    <Book className="size-4 inline mr-1" />
                    Course
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-base md:text-md gap-2">
                  <BookOpenCheck className="size-4" />
                  {examType} Exam Template
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

         

        <div className='flex justify-between mt-10'>
          <div>
            <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{examType} Exam Templates</h1>
            <Badge variant="secondary" className="text-sm">
              {courseExams?.length || 0} templates
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage and create {examType.toLowerCase()} exam templates for this course
          </p>
          </div>
            <div className="flex gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
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
                 <div
                key={exam.id}
                className=" h-full border relative    bg-white hover:border-primary/30 hover:shadow-md overflow-hidden   p-5 shadow-sm transition-all duration-300 transform rounded-2xl hover:-translate-y-1 "
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <BookOpenCheck className="size-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Template - {index + 1}</h3>
                </div>


                <div className="flex flex-wrap  items-center gap-5 justify-between ">
                  {/* Dates */}

                  <div className="flex  items-center gap-3 ">
                    <div className="mt-1 rounded-lg bg-red-100 p-2">
                      <Clock className="size-5 text-red-600" />
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground uppercase tracking-wide text-xs mb-1">Total Duration</p>
                      <p className="font-medium">
                        {exam.total_duration} mins
                      </p>
                    </div>
                  </div>

               
                    <Link 
                    to={`/teacher/courses/${courseId}/exams/${examType}/${exam.id}/detail`}>
                      <Button variant="default" className="w-32  gap-2 ">
                        View Details
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                
                </div>
              </div>
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
