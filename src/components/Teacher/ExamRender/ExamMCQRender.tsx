import { Button } from '@/components/ui/button';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import type {
  CourseExamQuestionType,
  CourseExamOptionEntity,
} from '@/types/courseexamquestion';
import { Edit3, Trash2 } from 'lucide-react';

interface Props {
  type: string;
  tasks: CourseExamQuestionType[];
  onEdit: (task: CourseExamQuestionType) => void;
  onDelete: (taskId: number) => void;
  isParagraphGroup?: boolean;
}

export default function ExamMCQRender({
  type,
  tasks,
  onEdit,
  onDelete,
  isParagraphGroup = false,
}: Props) {
  if (tasks.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* ===== Header ===== */}
      <header className="mb-6 flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-semibold text-slate-800">{type}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {tasks.length} Questions
        </span>
      </header>

      {/* ===== Question List ===== */}
      <div className="space-y-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border bg-slate-50 p-5 transition hover:shadow-sm"
          >
            {/* ===== Question Top Bar ===== */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {index + 1}
                </span> */}

                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10">
                  {task.points} pts
                </span>
              </div>

              <div className="flex gap-1">
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

            {/* ===== Content ===== */}
            {!isParagraphGroup ? (
              /* ===== Resizable Layout ===== */
              <ResizablePanelGroup
                orientation="horizontal"
                className="h-[420px] w-full overflow-hidden rounded-xl border bg-white"
              >
                {/* Question */}
                <ResizablePanel defaultSize={60}>
                  <div className="flex h-full flex-col overflow-hidden">
                    <div className="sticky top-0 z-10 border-b bg-white px-4 py-3">
                      <h4 className="text-sm font-semibold text-slate-700">
                        Question
                      </h4>
                    </div>

                    <div
                      className="flex-1 overflow-y-auto px-4 py-3 prose prose-slate max-w-none text-sm"
                      dangerouslySetInnerHTML={{
                        __html: task.question || '',
                      }}
                    />
                  </div>
                </ResizablePanel>

                {/* <ResizableHandle withHandle /> */}

                {/* Options */}
                <ResizablePanel defaultSize={40}>
                  <div className="flex h-full flex-col overflow-hidden">
                    <div className="sticky top-0 z-10 border-b bg-white px-4 py-3">
                      <h4 className="text-sm font-semibold text-slate-700">
                        Options
                      </h4>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-3">
                      <OptionList task={task} type={type} />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              /* ===== Paragraph Group Layout ===== */
              <div className="space-y-4">
                <div
                  className="rounded-xl border bg-white p-4 prose prose-slate max-w-none text-sm"
                  dangerouslySetInnerHTML={{
                    __html: task.question || '',
                  }}
                />

                <div className="rounded-xl border bg-white p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">
                    Options
                  </h4>
                  <OptionList task={task} type={type} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== Option Renderer ===== */
function OptionList({
  task,
  type,
}: {
  task: CourseExamQuestionType;
  type: string;
}) {
  if (type === 'Multiple Choice Questions') {
    return (
      <ul className="space-y-2">
        {task.options?.map(
          (option: CourseExamOptionEntity, index: number) => (
            <li
              key={option.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                option.is_correct
                  ? 'bg-emerald-100 text-emerald-800 font-medium'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold border">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option.option_text}</span>
              {option.is_correct && (
                <span className="text-xs font-semibold">✓</span>
              )}
            </li>
          )
        )}
      </ul>
    );
  }

  return (
    <ul className="space-y-2">
      {['true', 'false'].map((value, index) => {
        const isCorrect = task.correct_answer === value;
        return (
          <li
            key={value}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
              isCorrect
                ? 'bg-emerald-100 text-emerald-800 font-medium'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold border">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="capitalize">{value}</span>
            {isCorrect && (
              <span className="ml-auto text-xs font-semibold">✓</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
