import { Button } from '@/components/ui/button';
import type { CourseExamQuestionType } from '@/types/courseexamquestion';
import { Edit3, Trash2 } from 'lucide-react';

interface Props {
  type: string;
  tasks: CourseExamQuestionType[];
  onEdit: (task: CourseExamQuestionType) => void;
  onDelete: (taskId: number) => void;
}

export default function ExamParagraphRender({ type, tasks, onEdit, onDelete }: Props) {
    if (tasks.length === 0) return null;
    return (
        <section className="rounded-2xl border bg-slate-300/5 p-4">
    <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">
        {type}
      </h3>
      <span className="text-sm text-slate-500">
        {tasks.length} questions
      </span>
    </header>

    <div className="space-y-6">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="rounded-xl border bg-slate-50 p-4 transition hover:shadow-sm"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                {index + 1}
              </span>

              {/* Paragraph */}
              <div className="space-y-3">
                <div className="prose prose-slate max-w-none leading-relaxed text-slate-800">
                  {task.question}
                </div>

                {/* Blanks preview */}
                {/* <div className="space-y-2">
                  {task.blanks?.map((blank: any, i: number) => (
                    <div
                      key={blank.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="font-medium text-slate-600">
                        {blank.id}
                      </span>
                      <span className="text-slate-500">
                        Options: {blank.options.join(', ')}
                      </span>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {task.points} pts
              </span>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                  onClick={() => onEdit(task)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
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
