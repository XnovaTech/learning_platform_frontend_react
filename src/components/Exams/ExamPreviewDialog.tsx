import { Card, CardContent } from '@/components/ui/card';
import { BookOpenCheck, CheckCircle2 } from 'lucide-react';
import type { CourseExamType } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExamPreviewDialogProps {
  groupExams: Record<string, CourseExamType[]>;
  answers: Record<number, any>;
  previewOpen: boolean;
  onClose: () => void;
}

export default function ExamPreviewDialog({ groupExams, answers, previewOpen, onClose }: ExamPreviewDialogProps) {
  return (
    <Dialog open={previewOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpenCheck className="size-5" />
            Exam Answers Preview
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          {Object.keys(groupExams).map((section, sectionIndex) => {
            const sectionExams = groupExams[section];
            const sectionAnswered = sectionExams.filter((exam) => answers.hasOwnProperty(exam.id)).length;

            return (
              <div key={section} className="space-y-4">
                {/* Header */}
                <div className="relative rounded-xl bg-slate-50 border border-slate-200 px-6 py-4">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-l-xl" />
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">{sectionIndex + 1}</div>
                      <h3 className="text-xl font-semibold text-slate-900">{section}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-slate-500">{sectionExams.length} Questions</p>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-green-100 text-green-700 text-sm font-medium">
                        <CheckCircle2 className="size-4" />
                        {sectionAnswered} answered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {sectionExams.map((exam, index) => {
                    const isAnswered = answers.hasOwnProperty(exam.id);
                    const answer = answers[exam.id];

                    return (
                      <Card key={exam.id} className="border p-1 border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <CardContent className="p-0 mb-1">
                          {/* Question Content */}
                          <div className="bg-white px-5 py-4">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 flex items-center justify-center font-bold text-sm mt-0.5">{index + 1}.</div>
                              <div className="flex-1 min-w-0">
                                <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: exam.question || '' }} />
                              </div>
                            </div>
                          </div>

                          {/* Answer Preview */}
                          <div className="p-4 bg-slate-50 border-t border-slate-200">
                            <div className="flex items-start gap-3">
                              <span className="font-semibold text-slate-700 text-sm mt-1">Your Answer:</span>
                              <div className="flex-1">
                                {isAnswered ? (
                                  <div className="text-slate-800">{typeof answer === 'object' ? JSON.stringify(answer, null, 2) : String(answer)}</div>
                                ) : (
                                  <span className="text-slate-500 italic">Not answered</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
