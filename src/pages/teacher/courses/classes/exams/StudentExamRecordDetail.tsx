import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { StudentExamMarkUpdatePayload } from '@/types/answer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import ExamAnswerResult from '@/components/Exams/ExamAnswerResult';
import { getStudentCourseExamDetail, updateStudentExamMark } from '@/services/studentCourseExamService';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Book, BookOpenCheck, School } from 'lucide-react';
import { enrollDetail } from '@/services/enrollService';
import type { ClassRoomExamType } from '@/types/classexam';
import { getClassExamDetails } from '@/services/classExamService';

export default function StudentExamRecordDetail() {
  const { enrollId, classExamId } = useParams();
  const enrollID = Number(enrollId);
  const classExamID = Number(classExamId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: data } = useQuery<ClassRoomExamType>({
    queryKey: ['exam-details', classExamID],
    queryFn: () => getClassExamDetails(classExamID),
    enabled: !!classExamID,
  });

  const {
    data: studentAnswers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['studentRecord', enrollID],
    queryFn: () => getStudentCourseExamDetail(Number(enrollID), data?.exam_type || ''),
    enabled: !!enrollID && !!data?.exam_type,
  });

  const { data: enrollment } = useQuery({
    queryKey: ['enrollment', enrollID],
    queryFn: () => enrollDetail(enrollID),
    enabled: !!enrollID,
  });

  const courseExams = data?.exams || [];

  const updateMarkMutation = useMutation({
    mutationFn: updateStudentExamMark,
    onSuccess: () => {
      toast.success('Point updated successfully ');
      setIsSubmitting(false);
      refetch();
    },
    onError: () => {
      toast.error('Failed to update score');
      setIsSubmitting(false);
    },
  });

  const handleScoreChange = async (examId: number, score: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    await updateMarkMutation.mutateAsync({
      enroll_id: enrollID,
      exam_id: examId,
      score,
    } as StudentExamMarkUpdatePayload);
  };

  const totalPossibleScore = courseExams.reduce((sum, exam) => sum + (exam.points || 0), 0) || 0;

  return (
    <div className="max-w-9xl mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="flex items-center gap-2 text-base md:text-md" to={`/teacher/courses/${enrollment?.class_room?.course?.id}`}>
                <Book className="size-4" />
                {enrollment?.class_room?.course?.title || 'Course'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="flex items-center gap-2 text-base md:text-md" to={`/teacher/courses/classes/${enrollment?.class_room?.id}`}>
                <School className="size-4" />
                {enrollment?.class_room?.class_name || 'Class'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                className="flex items-center gap-2 text-base md:text-md"
                to={`/teacher/courses/${enrollment?.class_room?.course?.id}/classes/${enrollment?.class_room?.id}/exams/${classExamID}/records`}
              >
                <BookOpenCheck className="size-4" />
                Student Exam Records
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 text-base md:text-md">Exam Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <Card className="py-10 items-center h-64 flex justify-center m-auto">
          <Spinner className="size-8  text-primary" />
        </Card>
      ) : (
        <ExamAnswerResult studentAnswers={studentAnswers} courseExams={courseExams} totalPossibleScore={totalPossibleScore} isTeacher={true} onScoreChange={handleScoreChange} />
      )}
    </div>
  );
}
