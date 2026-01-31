import { Button } from '@/components/ui/button';
import type { CourseExamQuestionType } from '@/types/courseexamquestion';
import { Edit3, Trash2 } from 'lucide-react';

interface Props {
  type: string;
  tasks: CourseExamQuestionType[];
  onEdit: (task: CourseExamQuestionType) => void;
  onDelete: (taskId: number) => void;
}

export default function ExamMatchingRender({ type, tasks, onEdit, onDelete }: Props) {
    if (tasks.length === 0) return null;
    return (
         <section className="rounded-2xl border bg-white/60 p-5 shadow-sm">
          {/* Header */}
          <header className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{type}</h3>
            <span className="text-sm text-slate-500">{tasks.length} questions</span>
          </header>

          <div className="space-y-6">
            {tasks.map((task) => {
              const groups = task.options?.reduce((acc: any, option: any) => {
                const key = option.pair_key || 'unknown';
                if (!acc[key]) acc[key] = [];
                acc[key].push(option);
                return acc;
              }, {});

              return (
                <div key={task.id} className="rounded-xl border bg-slate-50 p-4 transition hover:shadow-sm">
                  {/* Question */}
                  <div className="flex items-start justify-between gap-4">
                    {/* Question Number + Content */}
                    <div className="flex gap-4">
                      {/* Number */}
                      {/* <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{index + 1}</span> */}

                      {/* Question Content */}
                      <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: task.question || '' }} />
                    </div>

                    {/* Actions & Points */}
                    <div className="flex flex-col items-end gap-2">
                      {/* Points */}
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{task.points} pts</span>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => onEdit(task)}>
                          <Edit3 className="mr-1 h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(task.id)}>
                          <Trash2 className="mr-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Matching Pairs */}
                  <div className="mt-4 space-y-3">
                    {Object.entries(groups).map(([key, pair]: any) => {
                      const left = pair[0];
                      const right = pair[1];

                      return (
                        <div key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border bg-white p-3">
                          {/* Left */}
                          <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800">{left?.option_text}</div>

                          {/* Connector */}
                          <span className="text-slate-400 text-sm font-semibold">↔</span>

                          {/* Right */}
                          <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800">{right?.option_text}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
    )
}
