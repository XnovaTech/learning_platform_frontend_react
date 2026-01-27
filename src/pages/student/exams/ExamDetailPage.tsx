import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClassExamDetails } from '@/services/classExamService';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Spinner } from '@/components/ui/spinner';
import { Home, BookOpen, Users, BookOpenCheck } from 'lucide-react';
import type { ClassRoomExamType } from '@/types/classexam';
import { useState } from 'react';
import ExamAnswerResult from '@/components/Exams/ExamAnswerResult';
import ExamAnswerList from '@/components/Exams/ExamAnswerList';
import { TimerProvider } from '@/context/TimerContext';
import { getStudentExamsDetail } from '@/services/studentExamAnswerService';

export default function ExamDetailPage() {
  const [answers, setAnswers] = useState({});
  const { examId } = useParams<{ examId: string }>();
  const { enrollId } = useParams<{ enrollId: string }>();
  const { data: data, isLoading } = useQuery<ClassRoomExamType>({
    queryKey: ['exam-details', examId],
    queryFn: () => getClassExamDetails(Number(examId)),
    enabled: !!examId,
  });

  const examType = data?.exam_type;

  const { data: studentAnswers, refetch } = useQuery({
    queryKey: ['studentRecord', enrollId, examType],
    queryFn: () => getStudentExamsDetail(Number(enrollId), examType!),
    enabled: !!enrollId && !!examType,
  });


  const handleAnswer = (taskId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [taskId]: value }));
  };

  const sections = data?.exam?.sections || [];
  const allQuestions = sections.flatMap((section) => section.questions);
  const hasSubmittedAnswers = studentAnswers && Object.keys(studentAnswers).length > 0;
  const totalPossibleScore = allQuestions.reduce((sum: number, exam) => Number(sum) + (Number(exam.points) || 0), 0) || 0;
  const totalQuestions = allQuestions.length;

  return (
    <TimerProvider>
      <div className="">
        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="hidden md:inline-flex" asChild>
                <Link className="text-base gap-2" to="/student/home">
                  <Home className="size-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden md:inline-flex" />

            <BreadcrumbItem className="hidden sm:flex">
              <BreadcrumbLink asChild>
                <Link className="text-base gap-2" to="/student/enrolls">
                  <BookOpen className="size-4" />
                  My Courses
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden sm:flex" />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link className="text-base gap-2" to={`/student/enrolls/${enrollId}`}>
                  <Users className="size-4" />
                  {data?.class_room?.class_name || 'ClassRoom'}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="text-base gap-2">
                <BookOpenCheck className="size-4" />
                {data?.exam_type}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white/50 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-xl space-y-6">
          {isLoading ? (
            <div className="flex items-center m-auto justify-center py-14">
              <Spinner className="text-primary size-7 md:size-8" />
            </div>
          ) : hasSubmittedAnswers ? (
            <ExamAnswerResult studentAnswers={studentAnswers} questions={allQuestions} totalPossibleScore={totalPossibleScore} enrollId={Number(enrollId)} />
          ) : (
            <ExamAnswerList
              sections={sections}
              answers={answers}
              handleAnswer={handleAnswer}
              enrollId={enrollId}
              data={data}
              totalQuestions={totalQuestions}
              totalPossibleScore={totalPossibleScore}
              refetch={refetch}
            />
          )}
        </div>
      </div>
    </TimerProvider>
  );
}
