import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import type { CourseExamQuestionType } from '@/types/courseexamquestion';

interface Props {
  type: string;
  tasks: CourseExamQuestionType[];
  onEdit: (task: CourseExamQuestionType) => void;
  onDelete: (taskId: number) => void;
}

export default function ExamShortRender({
  type,
  tasks,
  onEdit,
  onDelete,
}: Props) {
  if (tasks.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-semibold text-slate-800">{type}</h3>
        <span className="text-sm text-slate-500">
          {tasks.length} questions
        </span>
      </header>

      <div className="space-y-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border bg-slate-50 p-5 transition hover:shadow-md"
          >
            {/* Top Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Question Number */}
                {/* <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                  {index + 1}
                </span> */}

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

            {/* Question */}
            <div className="mt-4 max-h-80 overflow-y-auto rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div
                className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800"
                dangerouslySetInnerHTML={{
                  __html: task.question || "",
                }}
              />
            </div>

            {/* Answer */}
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              <span className="font-medium">Answer:</span>{" "}
              <span className="font-semibold">{task.correct_answer}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
