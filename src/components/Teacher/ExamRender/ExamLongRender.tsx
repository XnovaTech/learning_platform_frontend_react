import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import type {  CourseExamType, LongAnswerExtraData } from '@/types/task';

interface Props {
    type: string;
    tasks: CourseExamType[];
    onEdit: (task: CourseExamType) => void;
    onDelete: (taskId: number) => void;
}

export default function ExamLongRender({ type, tasks, onEdit, onDelete }: Props) {
    if (tasks.length === 0) return null;

    return (
        <section className="p-4 border rounded-2xl bg-slate-300/5">
          <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
            <h3 className="font-semibold text-lg">{type}</h3>
            <span className="text-sm text-slate-500">{tasks.length} questions</span>
          </header>

          <div className="space-y-6">
            {tasks.map((task, index) => (
              <div key={task.id} className="rounded-xl border bg-slate-50 p-4 transition hover:shadow-sm">
                {/* Question Row */}
                <div className=" flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{index + 1}</span>
                    {/* Question Content*/}
                    <div className="space-y-2">
                      <div
                        className="prose prose-slate max-w-none  leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{
                          __html: task.question || '',
                        }}
                      />
                      <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        <span className="text-xs text-muted-foreground italic">Min words: {(task.extra_data as LongAnswerExtraData)?.min_word_count}</span>
                      </div>
                    </div>
                    {/* Answer */}
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{task.points} pts</span>
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => onEdit(task)}>
                        <Edit3 className="mr-1 h-4 w-4" />

                      </Button>

                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(task.id!)}>
                        <Trash2 className="mr-1 h-4 w-4" />

                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
    )
}