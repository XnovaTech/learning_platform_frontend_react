import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, Edit, BadgeQuestionMark, BookOpen, Layers } from 'lucide-react';
import type { CourseExamType, ExamType } from '@/types/courseexam';
import { Spinner } from '../ui/spinner';
import { CourseExamForm } from './CourseExamForm';
import { CourseExamSectionForm } from './CourseExamSectionForm';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CourseExamPayload } from '@/types/courseexam';
import type { CourseExamSectionPayload, CourseExamSectionType } from '@/types/courseexamsection';

type Props = {
  exam: CourseExamType | null;
  isLoading: boolean;
  courseId: number;
  examType: ExamType;
};

export default function CourseExamList({ exam, isLoading, courseId, examType }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CourseExamType | null>(null);
  const [editingSection, setEditingSection] = useState<CourseExamSectionType | null>(null);

  const defaultExamForm: CourseExamPayload = {
    course_id: courseId,
    exam_type: examType,
    intro: '',
    total_duration: 0,
  };

  const defaultExamSectionForm: CourseExamSectionPayload = {
    course_exam_id: 0,
    section_name: '',
    duration: 0,
  };

  const [form, setForm] = useState<CourseExamPayload>(defaultExamForm);
  const [sectionForm, setSectionForm] = useState<CourseExamSectionPayload>(defaultExamSectionForm);

  const handleEditExam = (exam: CourseExamType) => {
    setEditingItem(exam);
    setForm({
      course_id: courseId,
      exam_type: exam.exam_type,
      intro: exam.intro || '',
      total_duration: exam.total_duration,
    });
    setIsFormOpen(true);
  };

  const handleCreateSection = (examId: number) => {
    setEditingSection(null);
    setSectionForm({ ...defaultExamSectionForm, course_exam_id: examId });
    setIsSectionFormOpen(true);
  };

  const handleEditSection = (examId: number, section: CourseExamSectionType) => {
    setEditingSection(section);
    setSectionForm({
      course_exam_id: examId,
      section_name: section.section_name,
      duration: section.duration,
    });
    setIsSectionFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleSectionFormSuccess = () => {
    setIsSectionFormOpen(false);
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : exam == null ? (
        <CourseExamForm open={isFormOpen} onOpenChange={setIsFormOpen} isModal={false} courseId={courseId} examType={examType} form={form} setForm={setForm} onSuccess={handleFormSuccess} />
      ) : (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="border-b  rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl">{examType} Exam </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Total Duration: <span className="font-medium">{exam.total_duration} minutes</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEditExam(exam)}>
                  <Edit className="size-4 mr-1" /> Edit Exam
                </Button>
                <Button size="sm" onClick={() => handleCreateSection(exam.id)}>
                  <Plus className="size-4 mr-1" /> Add Section
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Introduction</p>
              {exam.intro ? (
                <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: exam.intro }} />
              ) : (
                <span className="italic text-muted-foreground">No introduction provided.</span>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-3">
              <div className="text-sm font-medium flex items-center gap-2">
                <Layers className="size-4" />
                Sections ({exam.sections?.length || 0})
              </div>

              {exam.sections && exam.sections.length > 0 ? (
                <div className="space-y-3">
                  {exam.sections
                    .sort((a, b) => a.section_name - b.section_name)
                    .map((section) => (
                      <div key={section.id} className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex size-9 ${section.section_name.toLowerCase() == 'break' ? 'bg-red-100 text-red-600 px-7' : 'bg-primary/10 text-primary'} items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold`}
                          >
                            {section.section_name}
                          </div>
                          <div>
                            <p className="font-medium">Section {section.section_name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" /> {section.duration} mins
                            </div>
                          </div>
                        </div>

                        {section.section_name.toLowerCase() !== 'break' && (
                          <div className="flex items-center gap-2">
                            <Button asChild size="sm">
                              <Link to={`/teacher/courses/${courseId}/exams/${exam.exam_type}/questions/create/${section.id}`}>
                                <BadgeQuestionMark className="size-4 mr-1" /> Create Questions
                              </Link>
                            </Button>
                            <Button size="sm" variant="primary" onClick={() => handleEditSection(exam.id, section)}>
                              <Edit className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">No sections created yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {editingItem && (
        <CourseExamForm open={isFormOpen} onOpenChange={setIsFormOpen} editingItem={editingItem} courseId={courseId} examType={examType} form={form} setForm={setForm} onSuccess={handleFormSuccess} />
      )}

      <CourseExamSectionForm
        open={isSectionFormOpen}
        onOpenChange={setIsSectionFormOpen}
        editingItem={editingSection}
        form={sectionForm}
        setForm={setSectionForm}
        onSuccess={handleSectionFormSuccess}
      />
    </div>
  );
}
