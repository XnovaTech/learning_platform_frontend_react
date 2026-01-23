import { Button } from '@/components/ui/button';
import type { CourseExamQuestionType, CourseExamOptionEntity } from '@/types/courseexamquestion';
import { Edit3, Trash2 } from 'lucide-react';

interface Props {
  type: string;
  tasks: CourseExamQuestionType[];
  onEdit: (task: CourseExamQuestionType) => void;
  onDelete: (taskId: number) => void;
}

export default function ExamMCQRender({ type, tasks, onEdit, onDelete }: Props) {
  if (tasks.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-semibold text-slate-800">{type}</h3>
        <span className="text-sm text-slate-500">{tasks.length} questions</span>
      </header>

      <div className="space-y-6">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="rounded-xl border bg-slate-50 p-5 transition hover:shadow-md"
          >
            {/* Top Row */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Question Number */}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                  {index + 1}
                </span>

                {/* Points */}
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {task.points} pts
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-600 hover:bg-blue-50"
                  onClick={() => onEdit(task)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Row (Side by Side) */}
            <div className="flex max-h-80 gap-4">
              {/* Question */}
              <div className="flex-1 overflow-y-auto rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <div
                  className="prose prose-slate max-w-none text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: task.question || '',
                  }}
                />
              </div>

              {/* Options */}
              <div className="flex min-w-64 flex-col rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">
                  Options
                </h4>

                <div className="flex-1 overflow-y-auto">
                  {type === 'Multiple Choice Questions' ? (
                    <ul className="space-y-2">
                      {task.options?.map(
                        (option: CourseExamOptionEntity, optIndex: number) => (
                          <li
                            key={option.id}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
                              ${
                                option.is_correct
                                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 font-medium'
                                  : 'border bg-slate-50 text-slate-700 hover:bg-slate-100'
                              }`}
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold">
                              {String.fromCharCode(65 + optIndex)}
                            </span>

                            <span className="flex-1">{option.option_text}</span>

                            {option.is_correct && (
                              <span className="text-xs font-semibold text-emerald-700">
                                Correct
                              </span>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <ul className="space-y-2">
                      {['true', 'false'].map((value, index) => {
                        const isCorrect = task.correct_answer === value;
                        return (
                          <li
                            key={value}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
                              ${
                                isCorrect
                                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 font-medium'
                                  : 'border bg-slate-50 text-slate-700 hover:bg-slate-100'
                              }`}
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold">
                              {String.fromCharCode(65 + index)}
                            </span>

                            <span className="capitalize">{value}</span>

                            {isCorrect && (
                              <span className="ml-auto text-xs font-semibold text-emerald-700">
                                Correct
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
