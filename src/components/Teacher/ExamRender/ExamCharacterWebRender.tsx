import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CourseExamQuestionType } from '@/types/courseexamquestion';

interface ExamCharacterWebRenderProps {
  type: string;
  tasks: CourseExamQuestionType[];
  onEdit: (task: CourseExamQuestionType) => void;
  onDelete: (id: number) => void;
}

export default function ExamCharacterWebRender({ type, tasks, onEdit, onDelete }: ExamCharacterWebRenderProps) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800">{type}</h3>
        <span className="text-sm text-slate-500">{tasks.length} questions</span>
      </header>

      {/* Task List */}
      <div className="space-y-5">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              {/* Left Content */}
              <div className="flex-1 space-y-4">
                {/* Meta */}
                <div className=" flex justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">{index + 1}</span> */}

                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/10">Character Web</span>

                    <span className="text-xs font-medium text-slate-500">{task.points} pts</span>
                  </div>
                  {/* Actions */}
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="text-rose-500 hover:bg-rose-50 hover:text-rose-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Question */}
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div
                    className="prose prose-slate max-w-none text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: task.question || '',
                    }}
                  />
                </div>

                {/* Character Web Config */}
                {task.options && (
                  <div className="rounded-xl border bg-slate-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-slate-700">Character Web Configuration</h4>

                    <div className="">
                      {/* Center */}
                      <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                        <span className="text-xs text-slate-500">Center Label</span>
                        <div className="mt-1 text-sm font-semibold text-slate-800">{task.options.find((opt) => opt.pair_key === 'center')?.option_text || 'N/A'}</div>
                      </div>

                      {/* Targets */}
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500">Targets</span>

                        <div className="grid grid-cols-4 ">
                          {task.options
                            .filter((opt) => opt.pair_key?.startsWith('T'))
                            .sort((a, b) => Number(a.pair_key?.replace('T', '')) - Number(b.pair_key?.replace('T', '')))
                            .map((opt, i) => (
                              <div key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200 m-2">
                                <span className="text-slate-700">{opt.option_text}</span>

                                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${opt.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {opt.is_correct ? 'Correct' : 'Wrong'}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
