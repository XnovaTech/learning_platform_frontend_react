import { useStudentData } from "@/context/StudentDataContext";
import { getUpcomingExamForStudent } from "@/services/studentCourseExamService";
import type { UpcomingExamForStudentType } from "@/types/answer";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BookOpen, Users } from "lucide-react";
import Loading from "@/components/Loading";
import { formatDate } from "@/utils/format";

export default function ExamPage() {
    const { studentData } = useStudentData();
    const studentId = studentData?.id;

    const { data: exams, isLoading } = useQuery<UpcomingExamForStudentType[]>({
        queryKey: ['get-exams', studentId],
        queryFn: () => getUpcomingExamForStudent(Number(studentId)),
        enabled: !!studentId
    });

    if (isLoading) {
        return <Loading />;
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            case 'ongoing':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'completed':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
            case 'missed':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Exams</h1>
                <p className="text-gray-600">View and manage your upcoming examinations</p>
            </div>

            {!exams || exams.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto h-24 w-24 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exams Found</h3>
                    <p className="text-gray-600">You don't have any upcoming exams at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam) => (
                        <Card key={exam.id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                                            {exam.course_title}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-600">
                                            {exam.exam_type}
                                        </CardDescription>
                                    </div>
                                    <Badge className={getStatusColor(exam.status)}>
                                        {exam.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{exam.class_name}</span>
                                </div>

                                {exam.start_date && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>Start: {formatDate(exam.start_date)}</span>
                                    </div>
                                )}

                                {exam.end_date && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>End: {formatDate(exam.end_date)}</span>
                                    </div>
                                )}

                                <div className="pt-2 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Exam ID: {exam.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
