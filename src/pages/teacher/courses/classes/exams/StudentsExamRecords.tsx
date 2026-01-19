import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getPerformanceLabel, getScoreBarColor, getScoreColor } from '@/mocks/tasks';
import { listStudentCourseExamRecords } from '@/services/studentCourseExamService';
import { getClass } from '@/services/classService';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ChevronRight, Book, School } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function StudentsExamRecords() {
  const { classId, courseId, examId } = useParams();
  const classRoomID = Number(classId);
  const courseID = Number(courseId);
  const examID = Number(examId);

  const { data: classroom } = useQuery({
    queryKey: ['classes', classRoomID],
    queryFn: () => getClass(classRoomID),
    enabled: !!classRoomID,
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ['student-exam-records', courseID, classRoomID],
    queryFn: () => listStudentCourseExamRecords(courseID, classRoomID),
    enabled: !!courseID && !!classRoomID,
  });

  return (
    <div className="max-w-9xl mx-auto p-4  space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:flex ">
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to="/teacher/courses">
                <BookOpen className="size-4" />
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:flex " />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/${classroom?.course?.id}`}>
                <Book className="size-4" />
                {classroom?.course?.title || 'Course'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to={`/teacher/courses/classes/${classRoomID}`}>
                <School className="size-4" />
                {classroom?.class_name || 'Class'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base md:text-md gap-2">
              <BookOpen className="size-4" />
              Student Exam Records
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="shadow p-5 bg-white/40 border-0 backdrop-blur overflow-hidden">
        <h1 className="text-2xl font-semibold  tracking-tight bg-gradient-to-r mb-0 from-slate-900 to-slate-700 bg-clip-text text-transparent">Student Exam Records</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="size-8 text-primary " />
          </div>
        ) : records && records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record, index) => {
              const percentage = record.exam_total_points === 0 ? 0 : Math.round((record.total_points / record.exam_total_points) * 100);

              return (
                <Card key={index} className="group rounded-2xl border-0 shadow bg-white/80  backdrop-blur hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <CardContent className="px-4 md:px-5 py-2">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/60 to-primary text-white font-semibold text-xs shrink-0">#{index + 1}</div>
                          <div className="min-w-0">
                            <h3 className="text-sm capitalize sm:text-base font-semibold text-slate-900 truncate">
                              {record.first_name} {record.last_name}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-0.5 ${getScoreColor(record.total_points, record.exam_total_points)}`}>
                              {getPerformanceLabel(record.total_points, record.exam_total_points)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-lg sm:text-xl font-bold text-slate-900">
                            {record.total_points}
                            <span className="text-xs text-slate-400 font-normal"> / {record.exam_total_points}</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-600">{percentage}%</div>
                        </div>
                      </div>

                      {/* Progress  */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(record.total_points, record.exam_total_points)}`} style={{ width: `${percentage}%` }} />
                      </div>

                      {/* Detail */}
                      <Link to={`/teacher/courses/classes/${record.enroll_id}/exams/${examID}/records/detail`}>
                        <Button className="w-full text-center mx-auto  transition group/btn h-9">
                          <span className="font-medium text-xs sm:text-sm">View Details</span>
                          <ChevronRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary/90 p-4 mb-4">
              <BookOpen className="size-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold">No Exam Records yet </h4>
            <p className="text-sm sm:text-base text-slate-600 text-center max-w-md mb-5 sm:mb-6">Students haven't taken the exams yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
