import type { LessonTaskType, LongAnswerExtraData } from '@/types/task';

interface TaskListProps {
  tasks?: LessonTaskType[];
}

export default function TaskList({ tasks = [] }: TaskListProps) {
  const mcqTasks = tasks.filter((t) => t.task_type === 'mcq');
  const tfTasks = tasks.filter((t) => t.task_type === 'true_false');
  const blankTasks = tasks.filter((t) => t.task_type === 'fill_blank');
  const matchingTasks = tasks.filter((t) => t.task_type === 'matching');
  const dragTasks = tasks.filter((t) => t.task_type === 'drag_drop');
  const longTasks = tasks.filter((t) => t.task_type === 'long');
  const shortTasks = tasks.filter((t) => t.task_type === 'short');

  return (
    <div className="space-y-8">
      {/** ------------  Long Questions -------------- */}
      {longTasks.length > 0 && (
        <div className="p-4 border rounded-2xl bg-slate-300/5">
          <h3 className="font-semibold mb-4 text-lg">Long Questions</h3>

          <div className="space-y-6">
            {longTasks.map((task, index) => (
              <div key={task.id}>
                <div className=' flex gap-3'>
                  <p className='text-muted-foreground text-base font-semibold'>{index + 1}</p>
                   <div
                      className='leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: task.question || '' }}
                    />
                    <p className='text-muted-foreground text-base font-semibold'>({task.points} pts)</p>
                </div>

                <p className="mt-1 text-gray-700">Min Words: {(task.extra_data as LongAnswerExtraData)?.min_word_count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SHORT QUESTIONS ---------------- */}
      {shortTasks.length > 0 && (
        <div className="p-4 border rounded-2xl bg-slate-300/5">
          <h3 className="font-semibold mb-4 text-lg">Short Questions</h3>

          <div className="space-y-6">
            {shortTasks.map((task, index) => (
              <div key={task.id}>
                <div className=' flex gap-3'>
                  <p className='text-muted-foreground text-base font-semibold'>{index + 1}</p>
                   <div
                      className='leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: task.question || '' }}
                    />
                    <p className='text-muted-foreground text-base font-semibold'>({task.points} pts)</p>
                </div>
                <p className="mt-1 px-2 py-1 rounded bg-gray-100 text-gray-800">
                  Answer: <span className="font-semibold">{task.correct_answer}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/** -------------  Fill in The Questions ------------- */}
      {
        blankTasks.length > 0 && (
          <div className="p-4 border rounded-2xl bg-slate-300/5">
            <h3 className="font-semibold mb-4 text-lg">Fill in The Blanks Questions</h3>

            <div className="space-y-6">
              {blankTasks.map((task, index) => (
                <div key={task.id}>
                  <div className=' flex gap-3'>
                  <p className='text-muted-foreground text-base font-semibold'>{index + 1}</p>
                   <div
                      className='leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: task.question || '' }}
                    />
                    <p className='text-muted-foreground text-base font-semibold'>({task.points} pts)</p>
                </div>

                  <p className="mt-1 px-2 py-1 rounded bg-gray-100 text-gray-800">
                    Answers: <span className="font-semibold">{(task.correct_answer)}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* ---------------- MCQ ---------------- */}
      {mcqTasks.length > 0 && (
        <div className="p-4 border rounded-2xl bg-slate-300/5">
          <h3 className="font-semibold mb-4 text-lg">MCQ Questions</h3>

          <div className="space-y-6">
            {mcqTasks.map((task, index) => (
              <div key={task.id}>
                 <div className=' flex gap-3'>
                  <p className='text-muted-foreground text-base font-semibold'>{index + 1}</p>
                   <div
                      className='leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: task.question || '' }}
                    />
                    <p className='text-muted-foreground text-base font-semibold'>({task.points} pts)</p>
                </div>

                <ul className="list-disc list-inside space-y-1 mt-2">
                  {task.options?.map((option: any) => (
                    <li key={option.id} className={`px-2 py-1 rounded ${option.is_correct ? 'bg-white text-green-800 font-semibold' : 'bg-gray-100 text-gray-800'}`}>
                      {option.option_text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TRUE / FALSE ---------------- */}
      {tfTasks.length > 0 && (
        <div className="p-4 border rounded-2xl bg-slate-300/5">
          <h3 className="font-semibold mb-4 text-lg">True/False Questions</h3>

          <div className="space-y-6">
            {tfTasks.map((task, index) => (
              <div key={task.id}>
                 <div className=' flex gap-3'>
                  <p className='text-muted-foreground text-base font-semibold'>{index + 1}</p>
                   <div
                      className='leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: task.question || '' }}
                    />
                    <p className='text-muted-foreground text-base font-semibold'>({task.points} pts)</p>
                </div>

                <p className="mt-2 px-2 py-1 rounded bg-gray-100 text-gray-800">
                  Correct Answer: <span className="font-semibold">{task.correct_answer === 'true' ? 'True' : 'False'}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- DRAG & DROP ---------------- */}
      {dragTasks.length > 0 && (
        <div className="p-4 border rounded-2xl bg-slate-300/5">
          <h3 className="font-semibold mb-4 text-lg">Drag & Drop Questions</h3>

          <div className="space-y-6">
            {dragTasks.map((task, index) => {
              const groups = task.options?.reduce((acc: any, opt: any) => {
                const groupKey = opt.pair_key?.replace(/^[A-Za-z]/, '');
                if (!acc[groupKey]) acc[groupKey] = { left: null, right: null };

                if (opt.pair_key.startsWith('I')) acc[groupKey].left = opt;
                if (opt.pair_key.startsWith('T')) acc[groupKey].right = opt;

                return acc;
              }, {});

              return (
                <div key={task.id}>
                   <div className=' flex gap-3'>
                  <p className='text-muted-foreground text-base font-semibold'>{index + 1}</p>
                   <div
                      className='leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: task.question || '' }}
                    />
                    <p className='text-muted-foreground text-base font-semibold'>({task.points} pts)</p>
                </div>

                  <div className="space-y-3">
                    {Object.entries(groups).map(([key, pair]: any) => (
                      <div key={key} className="grid grid-cols-2 gap-4 p-3 rounded-2xl border bg-white">
                        <div className="p-2 border rounded bg-white">{pair.left?.option_text}</div>
                        <div className="p-2 border rounded bg-white">{pair.right?.option_text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- MATCHING ---------------- */}
      {matchingTasks.length > 0 && (
        <div className="p-4 border rounded-2xl bg-slate-300/5">
          <h3 className="font-semibold mb-4 text-lg">Matching Questions</h3>

          <div className="space-y-6">
            {matchingTasks.map((task, index) => {
              const groups = task.options?.reduce((acc: any, option) => {
                const key = option.pair_key || 'unknown';
                if (!acc[key]) acc[key] = [];
                acc[key].push(option);
                return acc;
              }, {});

              return (
                <div key={task.id}>
                  <div className=' flex gap-3'>
                  <p className='text-muted-foreground text-base font-semibold'>{index + 1}</p>
                   <div
                      className='leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: task.question || '' }}
                    />
                    <p className='text-muted-foreground text-base font-semibold'>({task.points} pts)</p>
                </div>

                  <div className="space-y-3">
                    {Object.entries(groups).map(([key, pair]: any) => {
                      const left = pair[0];
                      const right = pair[1];

                      return (
                        <div key={key} className="grid grid-cols-2 gap-4 p-3 border rounded bg-gray-50">
                          <div className="p-2 border rounded bg-white">{left?.option_text}</div>
                          <div className="p-2 border rounded bg-white">{right?.option_text}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
