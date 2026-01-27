import { Button } from '@/components/ui/button';
import type { CourseExamQuestionType } from '@/types/courseexamquestion';
import { Edit3, Trash2 } from 'lucide-react';

interface Props {
  type: string;
  tasks: CourseExamQuestionType[];
  onEdit: (task: CourseExamQuestionType) => void;
  onDelete: (taskId: number) => void;
}

export default function ExamTableDragRender({ type, tasks, onEdit, onDelete }: Props) {
  if (tasks.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white/60 p-5 shadow-sm">
      {/* Header */}
      <header className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">{type}</h3>
        <span className="text-sm text-slate-500">{tasks.length} questions</span>
      </header>

      <div className="space-y-6">
        {tasks.map((task, index) => {
          // Parse options into items and rows
          const items: string[] = [];
          const rows: { id: string; claim: string; evidences: string[] }[] = [];

          task.options?.forEach((opt) => {
            if (opt.pair_key?.startsWith('I')) {
              items.push(opt.option_text);
            } else if (opt.pair_key?.startsWith('R')) {
              // Format: R-{rowId}-{type}-{index}
              const parts = opt.pair_key.split('-');
              const rowId = parts[1];
              const type = parts[2];
              const index = parts[3];

              let row = rows.find(r => r.id === rowId);
              if (!row) {
                row = { id: rowId, claim: '', evidences: [] };
                rows.push(row);
              }

              if (type === 'C') {
                row.claim = opt.option_text;
              } else if (type === 'E') {
                const evIndex = Number(index);
                while (row.evidences.length <= evIndex) {
                  row.evidences.push('');
                }
                row.evidences[evIndex] = opt.option_text;
              }
            }
          });

          return (
            <div key={task.id} className="rounded-xl border bg-slate-50 p-4 transition hover:shadow-sm">
              {/* Question */}
              <div className="flex items-start justify-between gap-4">
                {/* Question Number + Content */}
                <div className="flex gap-4">
                  {/* Number */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{index + 1}</span>

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

              {/* Table Items */}
              <div className="mt-4">
                <div className="mb-2 text-xs font-medium text-slate-600">Draggable Items:</div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, itemIndex) => (
                    <span key={itemIndex} className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-900 ring-1 ring-inset ring-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Table Rows */}
              <div className="mt-4 overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Claim</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Evidences</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-900">{row.claim}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {row.evidences.map((evidence, evIndex) => (
                              <span key={evIndex} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                                {evidence}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}