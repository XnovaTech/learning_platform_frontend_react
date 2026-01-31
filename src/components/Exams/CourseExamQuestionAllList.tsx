import type { CourseExamSectionType } from '@/types/courseexamsection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SectionQuestionList from './SectionQuestionList';
import { Layers } from 'lucide-react';

type Props = {
  sections: CourseExamSectionType[];
  refetch: () => void;
  courseId: number;
  examType: string;
};

export default function CourseExamQuestionAllList({ sections, refetch, courseId, examType }: Props) {
  return (
    <div className="space-y-8">
      <Tabs defaultValue={sections[0]?.section_name || ''} className="w-full">
        <div className="flex items-start flex-wrap justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Exam Questions  List</h3>
          <TabsList className="rounded-2xl bg-gray-50 shadow h-10">
            {sections.map((section) => (
              <TabsTrigger
                key={section.section_name}
                value={section.section_name}
                className="gap-2 text-sm rounded-xl px-4 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Section {section.section_name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {sections.length == 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Questions Found</h3>
            <p className="text-sm text-muted-foreground">Create sections first</p>
          </div>
        ) : (
          sections.map((section) => {
            return (
              <TabsContent key={section.section_name} value={section.section_name} className="space-y-8">
                <SectionQuestionList  questions={section.questions || []} refetch={refetch} courseId={courseId} examType={examType} />
              </TabsContent>
            );
          })
        )}
      </Tabs>
    </div>
  );
}
