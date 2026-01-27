import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeQuestionMark, Layers } from 'lucide-react';
import { CourseExamQuestionForm } from '@/components/Form/CourseExamQuestionForm';
import { Spinner } from '@/components/ui/spinner';
import SectionQuestionList from './SectionQuestionList';
import type { CourseExamQuestionType } from '@/types/courseexamquestion';
import { getCourseExamSection } from '@/services/courseExamSectionService';

type Props = {
  courseId: number;
  examType: string;
  sectionId?: number;
  editingItem?: CourseExamQuestionType | null;
  defaultTab?: 'form' | 'questions';
};

export default function CourseExamQuestionTabs({ courseId, examType, sectionId, editingItem, defaultTab = 'form' }: Props) {
  const targetSectionId = sectionId || editingItem?.section_id;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['courseExamQuestions', targetSectionId],
    queryFn: () => getCourseExamSection(targetSectionId!),
    enabled: !!targetSectionId && !Number.isNaN(targetSectionId),
  });

  const tabLabels = {
    form: editingItem ? 'Edit Question' : 'Create Question',
    questions: `Section ${data?.section_name || ''} Questions `,
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="border-b bg-linear-to-r from-slate-50 to-slate-100/50 px-6 pb-2 pt-0flex items-center justify-between">
        <TabsList className="grid  grid-cols-2 rounded-2xl bg-gray-50 shadow h-11 mt-0 pt-0">
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

      <TabsContent value="form" className="space-y-6 mt-0">
        <CourseExamQuestionForm sectionId={sectionId} editingItem={editingItem} />
      </TabsContent>

      <TabsContent value="questions" className="space-y-6 p-6 mt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : (
          <SectionQuestionList questions={data?.questions ?? []} refetch={refetch} courseId={courseId} examType={examType} />
        )}
      </TabsContent>
    </Tabs>
  );
}
