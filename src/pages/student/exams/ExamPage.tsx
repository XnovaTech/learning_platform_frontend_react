import { useStudentData } from "@/context/StudentDataContext";
import { getUpcomingExamForStudent } from "@/services/studentCourseExamService";
import type { UpcomingExamForStudentType } from "@/types/answer";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";
import Loading from "@/components/Loading";
import { formatDate } from "@/utils/format";

export default function ExamPage() {
  const { studentData } = useStudentData();
  const studentId = studentData?.id;

  const { data: exams, isLoading } = useQuery<UpcomingExamForStudentType[]>({
    queryKey: ["get-exams", studentId],
    queryFn: () => getUpcomingExamForStudent(Number(studentId)),
    enabled: !!studentId,
  });

  if (isLoading) return <Loading />;

  const statusStyles: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-700",
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    missed: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
        <p className="text-gray-500 mt-1">
          Track your upcoming, ongoing, and completed exams
        </p>
      </div>

      {/* Empty State */}
      {!exams || exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-20 w-20 text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-800">
            No exams scheduled
          </h3>
          <p className="text-gray-500 mt-2 max-w-sm">
            You don’t have any upcoming exams right now. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="group transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <CardHeader className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {exam.course_title}
                    </CardTitle>
                    <CardDescription>{exam.exam_type}</CardDescription>
                  </div>

                  <Badge
                    className={
                      statusStyles[exam.status.toLowerCase()] ??
                      "bg-gray-100 text-gray-700"
                    }
                  >
                    {exam.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Class */}
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {exam.class_name}
                </div>

                {/* Dates */}
                {exam.start_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Start: {formatDate(exam.start_date)}
                  </div>
                )}

                {exam.end_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    End: {formatDate(exam.end_date)}
                  </div>
                )}

                {/* Divider */}
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Exam ID: {exam.id}
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-primary"
                  >
                    View Exam
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
