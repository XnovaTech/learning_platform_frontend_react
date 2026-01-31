import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeQuestionMark, Layers, FileText } from 'lucide-react';
import { CourseExamQuestionForm } from '@/components/Form/CourseExamQuestionForm';
import { Spinner } from '@/components/ui/spinner';
import SectionQuestionList from './SectionQuestionList';
import { ExamParagraphList } from './ExamParagaphList';
import type { CourseExamQuestionType } from '@/types/courseexamquestion';
import { getCourseExamSection } from '@/services/courseExamSectionService';
import { getCourseExamParagraphs } from '@/services/courseExamParagraphService';

type Props = {
  courseId: number;
  examType: string;
  sectionId?: number;
  editingItem?: CourseExamQuestionType | null;
  defaultTab?: 'form' | 'questions' | 'paragraphs';
};

export default function CourseExamQuestionTabs({ courseId, examType, sectionId, editingItem, defaultTab = 'form' }: Props) {
  const targetSectionId = sectionId || editingItem?.section_id;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['courseExamQuestions', targetSectionId],
    queryFn: () => getCourseExamSection(targetSectionId!),
    enabled: !!targetSectionId && !Number.isNaN(targetSectionId),
  });

  // Fetch paragraphs for the current section
  const { data: paragraphs = [], refetch: refetchParagraphs } = useQuery({
    queryKey: ['courseExamParagraphs', targetSectionId],
    queryFn: () => getCourseExamParagraphs(targetSectionId!),
    enabled: !!targetSectionId && !Number.isNaN(targetSectionId),
    select: (data) => Array.isArray(data) ? data : [],
  });

  const tabLabels = {
    paragraph: 'Paragraph Section',
    form: editingItem ? 'Edit Question' : 'Create Question',
    questions: `Section ${data?.section_name || ''} Questions `,
    paragraphs: 'Manage Paragraphs',
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="border-b bg-linear-to-r from-slate-50 to-slate-100/50 px-6 pb-2 pt-0flex items-center justify-between">
        <TabsList className="grid grid-cols-3 rounded-2xl bg-gray-50 shadow h-11 mt-0 pt-0">
          <TabsTrigger value="paragraphs" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
            <FileText className="size-4" />
            {tabLabels.paragraphs}
          </TabsTrigger>
          <TabsTrigger value="form" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
            <BadgeQuestionMark className="size-4" />
            {tabLabels.form}
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-2 rounded-xl transition-all duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
            <Layers className="size-4" />
            {tabLabels.questions}
          </TabsTrigger>
          
        </TabsList>
      </div>

       <TabsContent value="paragraphs" className="space-y-6 p-6 mt-0">
        {targetSectionId ? (
          <ExamParagraphList sectionId={targetSectionId} paragraphs={paragraphs}  refetch={refetchParagraphs}/>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Please select a section to manage paragraphs.
          </div>
        )}
      </TabsContent>

      <TabsContent value="form" className="space-y-6 mt-0">
        <CourseExamQuestionForm 
          sectionId={sectionId} 
          //editingItem={editingItem} 
          paragraphs={paragraphs}
        />
      </TabsContent>

      <TabsContent value="questions" className="space-y-6 p-6 mt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : (
          <SectionQuestionList questions={data?.questions ?? []} refetch={refetch} courseId={courseId} examType={examType}  paragraphs={paragraphs}/>
        )}
      </TabsContent>

     
    </Tabs>
  );
}
