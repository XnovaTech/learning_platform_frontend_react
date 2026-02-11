import { Button } from '@/components/ui/button';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import type {
  CourseExamQuestionType,
} from '@/types/courseexamquestion';
import { Edit3, Trash2, BookOpen } from 'lucide-react';
import ExamLongRender from './ExamLongRender';
import ExamShortRender from './ExamShortRender';
import ExamMCQRender from './ExamMCQRender';
import ExamDragDropRender from './ExamDragDropRender';
import ExamMatchingRender from './ExamMatchingRender';
import ExamParagraphRender from './ExamParagraphRender';
import ExamTableDragRender from './ExamTableDragRender';
import ExamCharacterWebRender from './ExamCharacterWebRender';

interface Props {
  paragraphId: number;
  paragraphContent: string;
  questions: CourseExamQuestionType[];
  onEdit: (task: CourseExamQuestionType) => void;
  onDelete: (taskId: number) => void;
}

export default function ExamParagraphGroupRender({
  paragraphId,
  paragraphContent,
  questions,
  onEdit,
  onDelete,
}: Props) {
  if (questions.length === 0) return null;

  // Group questions by task_type
  const questionGroups = questions.reduce((acc, question) => {
    const taskType = question.task_type;
    if (!acc[taskType]) {
      acc[taskType] = [];
    }
    acc[taskType].push(question);
    return acc;
  }, {} as Record<string, CourseExamQuestionType[]>);

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* ===== Header ===== */}
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Paragraph-based Questions
            </h3>
            <span className="text-sm text-slate-500">Paragraph ID: {paragraphId}</span>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {questions.length} Questions
        </span>
      </header>

      {/* ===== Resizable Area ===== */}
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-[600px] max-h-[600px] w-full overflow-hidden rounded-xl border bg-slate-50"
      >
        {/* ===== Paragraph Panel ===== */}
        <ResizablePanel defaultSize={60} minSize={25}>
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
            {/* Sticky Title */}
            <div className="sticky top-0 z-10 border-b bg-white px-4 py-3">
              <h4 className="text-sm font-semibold text-slate-700">
                Paragraph Content
              </h4>
            </div>

            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 prose prose-slate max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: paragraphContent || '',
              }}
            />
          </div>
        </ResizablePanel>

        {/* <ResizableHandle withHandle /> */}

        {/* ===== Questions Panel ===== */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
            {/* Sticky Title */}
            <div className="sticky top-0 z-10 border-b bg-white px-4 py-3">
              <h4 className="text-sm font-semibold text-slate-700">
                Questions
              </h4>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {Object.entries(questionGroups).map(([taskType, taskQuestions]) => (
                <div key={taskType} className=" transition hover:shadow-sm">
                  

                  {/* Render based on task type */}
                  {(() => {
                    switch (taskType) {
                      case 'long':
                        return (
                          <ExamLongRender
                            type="Long Answer Questions"
                            tasks={taskQuestions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      case 'short':
                        return (
                          <ExamShortRender
                            type="Short Answer Questions"
                            tasks={taskQuestions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      case 'fill_blank':
                        return (
                          <ExamShortRender 
                            type="Fill in the Blanks Questions" 
                            tasks={taskQuestions} 
                            onEdit={onEdit} 
                            onDelete={onDelete} />
                        );
                      case 'mcq':
                        return (
                          <ExamMCQRender
                            type="Multiple Choice Questions"
                            tasks={taskQuestions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isParagraphGroup={true}
                          />
                        );
                      case 'true_false':
                        return(<ExamMCQRender type="True / False Questions" tasks={taskQuestions} onEdit={onEdit} onDelete={onDelete} isParagraphGroup={true} />)
                      case 'drag_drop':
                        return (
                          <ExamDragDropRender
                            type="Drag and Drop Questions"
                            tasks={taskQuestions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      case 'matching':
                        return (
                          <ExamMatchingRender
                            type="Matching Questions"
                            tasks={taskQuestions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      case 'paragraph_drag':
                        return (
                          <ExamParagraphRender
                            type="Paragraph Drag Questions"
                            tasks={taskQuestions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      case 'table_drag':
                        return (
                          <ExamTableDragRender
                            type="Table Drag Questions"
                            tasks={taskQuestions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      case 'character_web':
                        return (
                          <ExamCharacterWebRender
                            type="Character Web Questions"
                            tasks={taskQuestions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      default:
                        return (
                          <div className="rounded-xl border bg-white p-4">
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed">
                              {taskQuestions.map((task, index) => (
                                <div key={task.id} className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                                      {index + 1}
                                    </span>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                        onClick={() => onEdit(task)}
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                                        onClick={() => onDelete(task.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div
                                    className="mb-2 prose prose-slate max-w-none text-sm"
                                    dangerouslySetInnerHTML={{
                                      __html: task.question || '',
                                    }}
                                  />
                                  <div className="text-xs text-slate-500">{task.points} pts</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                    }
                  })()}
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
