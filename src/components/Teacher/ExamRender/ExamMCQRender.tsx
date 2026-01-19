import { Button } from '@/components/ui/button';
import type { CourseExamType } from '@/types/task';
import { Edit3, Trash2 } from 'lucide-react';

interface Props {
  type: string;
  tasks: CourseExamType[];
  onEdit: (task: CourseExamType) => void;
  onDelete: (taskId: number) => void;
}

export default function ExamMCQRender({ type, tasks, onEdit, onDelete }: Props) {
  if (tasks.length === 0) return null;
  return (
    <section className="rounded-2xl border bg-slate-300/5 p-4">
      <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">{type}</h3>
        <span className="text-sm text-slate-500">{tasks.length} questions</span>
      </header>
      <div className="space-y-6">
        {tasks.map((task, index) => (
          <div key={task.id} className="rounded-xl border bg-slate-50 p-4 transition hover:shadow-sm">
            {/* Question */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                {/* Question Number */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{index + 1}</span>

                {/* Question Content */}
                <div
                  className="prose prose-slate max-w-none mt-1 leading-relaxed text-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: task.question || '',
                  }}
                />
              </div>
              {/* Actions */}
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{task.points} pts</span>
                <div className="flex gap-3">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => onEdit(task)}>
                    <Edit3 className="mr-1 h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(task.id)}>
                    <Trash2 className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {type === 'Multiple Choice Questions' ? (
              <ul className="mt-4 flex flex-col space-y-3">
                {task.options?.map((option: any, optIndex: number) => (
                  <li
                    key={option.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
                        ${option.is_correct ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 font-medium' : 'border bg-white text-slate-700 hover:bg-slate-100'}`}
                  >
                    {/* Option Label (A, B, C...) */}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">{String.fromCharCode(65 + optIndex)}</span>
                    <span>{option.option_text}</span>

                    {option.is_correct && <span className="ml-auto text-xs font-semibold text-emerald-700">Correct</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-4 flex flex-col space-y-3">
                {['true', 'false'].map((value, index) => {
                  const correctAnswer = task.correct_answer === 'true' ? 'true' : 'false';

                  const isCorrect = correctAnswer === value;

                  return (
                    <li
                      key={value}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border transition
                    ${isCorrect ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 font-medium' : 'border bg-white text-slate-700 hover:bg-slate-100'}
                    `}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-300 text-xs font-semibold text-slate-700">{String.fromCharCode(65 + index)}</span>

                      <span className="capitalize">{value}</span>

                      {isCorrect && <span className="ml-auto text-xs font-semibold text-emerald-700">Correct</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
