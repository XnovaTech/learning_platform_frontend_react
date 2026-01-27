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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{type}</h3>
        <span className="text-sm text-gray-500">{tasks.length} questions</span>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Character Web
                  </span>
                  <span className="text-sm text-gray-500">Points: {task.points}</span>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: task.question || '' }} />
                </div>

                {task.options && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Character Web Configuration:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-600">Center Label:</span>
                        <div className="mt-1 text-sm font-medium">
                          {task.options.find(opt => opt.pair_key === 'center')?.option_text || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Targets:</span>
                        <div className="mt-1 space-y-1">
                          {task.options
                            .filter(opt => opt.pair_key?.startsWith('T'))
                            .sort((a, b) => Number(a.pair_key?.replace('T', '')) - Number(b.pair_key?.replace('T', '')))
                            .map((opt, index) => (
                              <div key={index} className="flex items-center justify-between text-sm bg-white px-2 py-1 rounded border">
                                <span>{opt.option_text}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  opt.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
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

              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}