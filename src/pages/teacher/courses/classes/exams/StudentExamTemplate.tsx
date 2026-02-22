import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { BookOpen, Book, School } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useQuery } from '@tanstack/react-query';
import { getClass } from '@/services/classService';
import { getClassExamDetails } from '@/services/classExamService';
import { QuestionItem } from '@/components/QuestionItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ClassExamSectionType } from '@/types/courseexamsection';
import { groupQuestionsByParagraph } from '@/helper/examHelper';
import { ParagraphQuestionGroup } from '@/components/Exams/ParagraphQuestionGroup';

export default function StudentExamTemplate() {
  const { classId, examId } = useParams();
  const classRoomID = Number(classId);
  //const courseID = Number(courseId);
  const examID = Number(examId);

  const { data: classroom } = useQuery({
    queryKey: ['classes', classRoomID],
    queryFn: () => getClass(classRoomID),
    enabled: !!classRoomID,
  });

  const { data: examData, isLoading } = useQuery({
    queryKey: ['exam-details', examID],
    queryFn: () => getClassExamDetails(examID),
    enabled: !!examID,
  });

  const sections = examData?.exam?.sections || [];

  if (isLoading) {
    return (
      <div className="max-w-9xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-center py-20">
          <Spinner className="size-8 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-9xl mx-auto p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:flex">
            <BreadcrumbLink asChild>
              <Link className="text-base md:text-md gap-2" to="/teacher/courses">
                <BookOpen className="size-4" />
                Courses
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:flex" />
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
              Student Exam Template
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="shadow p-5 bg-white/40 border-0 backdrop-blur overflow-hidden">
        {sections && sections.length > 0 ? (
          <Tabs defaultValue={sections[0]?.section_name || ''} className="w-full">
            <div className="flex items-start flex-wrap justify-between mb-4">
              <h3 className="text-2xl font-semibold tracking-tight bg-linear-to-r mb-0 from-slate-900 to-slate-700 bg-clip-text text-transparent">Exam Template</h3>

              <TabsList className="rounded-2xl bg-gray-50 shadow h-10">
                {sections.map((section: ClassExamSectionType) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.section_name}
                    className="gap-2 text-sm rounded-xl px-4 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Section {section.section_name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {sections.map((section: ClassExamSectionType) => {
              const currentSectionExams = section.questions || [];

              return (
                <TabsContent key={section.section_name} value={section.section_name} className="space-y-6">
                  {/* Section Header */}
                  <div className="relative rounded-xl bg-slate-50 border border-slate-200 shadow shadow-primary/10 px-6 py-3">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-l-xl" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h2 className="text-md font-semibold text-slate-900">Section {section.section_name}</h2>
                          <p className="text-sm text-slate-500">{section.duration} Minutes</p>
                        </div>
                      </div>
                      {currentSectionExams.length > 1 && <p className="text-sm text-slate-500 font-medium text-right">{currentSectionExams.length} Questions</p>}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-6">
                    {(() => {
                      const { paragraphGroups, questionsWithoutParagraph } = groupQuestionsByParagraph(currentSectionExams);

                      return (
                        <>
                          {/* Paragraph-based questions */}
                          {paragraphGroups.map((group) => {
                            const { paragraphId, paragraph, questions } = group;

                            return (
                              <ParagraphQuestionGroup key={paragraphId} paragraph={paragraph} questions={questions} heightClassName="h-[400px]">
                                <div className="flex-1 overflow-y-auto space-y-4 p-4 pr-1">
                                  {questions.map((question: any, index: number) => {
                                    return <QuestionItem key={question.id} question={question} index={index} isAnswered={false} handleAnswer={() => {}} answers={{}} />;
                                  })}
                                </div>
                              </ParagraphQuestionGroup>
                            );
                          })}

                          {/* Regular questions (without paragraph) */}
                          {questionsWithoutParagraph.length > 0 && (
                            <div className="space-y-4">
                              {questionsWithoutParagraph.map((exam: any, index: number) => {
                                return <QuestionItem key={exam.id} question={exam} index={index} isAnswered={false} handleAnswer={() => {}} answers={{}} />;
                              })}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/90 p-4 mb-4">
              <BookOpen className="size-8 text-white" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-1">No exam questions available for this moment.</h4>
          </div>
        )}
      </Card>
    </div>
  );
}
