import type { LessonTaskType, LongAnswerExtraData } from '@/types/task';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '@/services/lessonTaskService';
import { toast } from 'sonner';
import { useState } from 'react';
import { ConfirmDialog } from '../ui/dialog-context-menu';
import { Trash2, Edit3 } from 'lucide-react';
import TaskBuilderManager from './TaskManager';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { mapTaskToBuilderInitial } from '@/helper/mapTaskToBuilderInitial';

interface TaskListProps {
  tasks?: LessonTaskType[];
  refetch: () => Promise<any>;
}

export default function TaskList({ tasks = [], refetch }: TaskListProps) {
  const mcqTasks = tasks.filter((t) => t.task_type === 'mcq');
  const tfTasks = tasks.filter((t) => t.task_type === 'true_false');
  const blankTasks = tasks.filter((t) => t.task_type === 'fill_blank');
  const matchingTasks = tasks.filter((t) => t.task_type === 'matching');
  const dragTasks = tasks.filter((t) => t.task_type === 'drag_drop');
  const longTasks = tasks.filter((t) => t.task_type === 'long');
  const shortTasks = tasks.filter((t) => t.task_type === 'short');
  const paragraphDragTasks = tasks.filter((t) => t.task_type === 'paragraph_drag');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<LessonTaskType | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: async () => {
      toast.success('Task Deleted Successfully');
      await queryClient.invalidateQueries({ queryKey: ['task', deletingId] });
      setConfirmOpen(false);
      setDeletingId(null);
      refetch();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete'),
  });

  const askDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const openEditDialog = (task: LessonTaskType) => {
    setEditingTask(task);
    setEditOpen(true);
  };

  return (
    <div className="space-y-8">
      {/** ------------  Long Questions -------------- */}
      {longTasks.length > 0 && (
        <section className="p-4 border rounded-2xl bg-slate-300/5">
          <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
            <h3 className="font-semibold text-lg">Long Questions</h3>
            <span className="text-sm text-slate-500">{longTasks.length} questions</span>
          </header>

          <div className="space-y-6">
            {longTasks.map((task, index) => (
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
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => openEditDialog(task)}>
                        <Edit3 className="mr-1 h-4 w-4" />

                      </Button>

                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => askDelete(task.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />

                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- SHORT QUESTIONS ---------------- */}
      {shortTasks.length > 0 && (
        <section className="rounded-2xl border bg-slate-300/5 p-4">
          <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">Short Questions</h3>
            <span className="text-sm text-slate-500">{shortTasks.length} questions</span>
          </header>
          <div className="space-y-6">
            {shortTasks.map((task, index) => (
              <div key={task.id} className="rounded-xl border bg-slate-50 p-4 transition hover:shadow-sm">
                {/* Question Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{index + 1}</span>

                    {/* Question Content*/}
                    <div className="space-y-2">
                      <div
                        className="prose prose-slate max-w-none leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{
                          __html: task.question || '',
                        }}
                      />

                      {/* Answer */}
                      <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        <span className="font-medium">Answer:</span> <span className="font-semibold">{task.correct_answer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{task.points} pts</span>
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => openEditDialog(task)}>
                        <Edit3 className="mr-1 h-4 w-4" />

                      </Button>

                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => askDelete(task.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
  
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/** -------------  Fill in The Questions ------------- */}
      {blankTasks.length > 0 && (
        <section className="rounded-2xl border bg-slate-300/5 p-4">
          <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">Fill in the Blanks</h3>
            <span className="text-sm text-slate-500">{blankTasks.length} questions</span>
          </header>

          <div className="space-y-6">
            {blankTasks.map((task, index) => (
              <div key={task.id} className="rounded-xl border bg-slate-50 p-4 transition hover:shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex gap-4">
                    {/* Question Number */}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{index + 1}</span>

                    {/* Question & Answer */}
                    <div className="space-y-3">
                      <div
                        className="prose prose-slate max-w-none mt-1 leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{
                          __html: task.question || '',
                        }}
                      />

                      {/* Correct Answer */}
                      <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        <span className="font-medium">Answer: </span> <span className="font-semibold">{task.correct_answer}</span>
                      </div>
                    </div>
                  </div>

                   {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{task.points} pts</span>
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => openEditDialog(task)}>
                        <Edit3 className="mr-1 h-4 w-4" />

                      </Button>

                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => askDelete(task.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
  
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- MCQ ---------------- */}
      {mcqTasks.length > 0 && (
        <section className="rounded-2xl border bg-slate-300/5 p-4">
          <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">Multiple Choice Questions</h3>
            <span className="text-sm text-slate-500">{mcqTasks.length} questions</span>
          </header>
          <div className="space-y-6">
            {mcqTasks.map((task, index) => (
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
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => openEditDialog(task)}>
                        <Edit3 className="mr-1 h-4 w-4" />

                      </Button>

                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => askDelete(task.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
  
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Options */}
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- TRUE / FALSE ---------------- */}
      {tfTasks.length > 0 && (
        <section className="rounded-2xl border bg-slate-300/5 p-4">
          <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">True/False Questions</h3>
            <span className="text-sm text-slate-500">{tfTasks.length} questions</span>
          </header>
          <div className="space-y-6">
            {tfTasks.map((task, index) => (
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
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => openEditDialog(task)}>
                        <Edit3 className="mr-1 h-4 w-4" />

                      </Button>

                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => askDelete(task.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
  
                      </Button>
                    </div>
                  </div>
                </div>
                {/* true/false */}

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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- DRAG & DROP QUESTIONS ---------------- */}
      {dragTasks.length > 0 && (
        <section className="rounded-2xl border bg-white/60 p-5 shadow-sm">
          {/* Header */}
          <header className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Drag & Drop Questions</h3>
            <span className="text-sm text-slate-500">{dragTasks.length} questions</span>
          </header>

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
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => openEditDialog(task)}>
                          <Edit3 className="mr-1 h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => askDelete(task.id)}>
                          <Trash2 className="mr-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Pairs */}
                  <div className="mt-4 space-y-3">
                    {Object.entries(groups).map(([key, pair]: any) => (
                      <div key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border bg-white p-3">
                        {/* Left Item */}
                        <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800">{pair.left?.option_text}</div>

                        {/* Arrow */}
                        <span className="text-slate-400 text-sm font-semibold">↔</span>

                        {/* Right Item */}
                        <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800">{pair.right?.option_text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- MATCHING QUESTIONS ---------------- */}
      {matchingTasks.length > 0 && (
        <section className="rounded-2xl border bg-white/60 p-5 shadow-sm">
          {/* Header */}
          <header className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Matching Questions</h3>
            <span className="text-sm text-slate-500">{matchingTasks.length} questions</span>
          </header>

          <div className="space-y-6">
            {matchingTasks.map((task, index) => {
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
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => openEditDialog(task)}>
                          <Edit3 className="mr-1 h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => askDelete(task.id)}>
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
      )}

       {/* ---------------- Paragraph QUESTIONS ---------------- */}
      {/* ---------------- PARAGRAPH DRAG ---------------- */}
{paragraphDragTasks.length > 0 && (
  <section className="rounded-2xl border bg-slate-300/5 p-4">
    <header className="mb-5 p-3 flex items-center justify-between shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">
        Paragraph (Dropdown Blanks)
      </h3>
      <span className="text-sm text-slate-500">
        {paragraphDragTasks.length} questions
      </span>
    </header>

    <div className="space-y-6">
      {paragraphDragTasks.map((task, index) => (
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
                  onClick={() => openEditDialog(task)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => askDelete(task.id)}
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
)}

      {/* Edit Dialog*/}
      <Dialog open={editOpen} onOpenChange={setEditOpen} modal={false}>
        <DialogTrigger />
        <DialogContent className="w-[85vw] max-w-none max-h-[95vh] overflow-y-auto p-6" onCloseAutoFocus={(e) => e.preventDefault()} onOpenAutoFocus={(e) => e.preventDefault()}>
          {editingTask && (
            <>
              <DialogTitle>Edit Task</DialogTitle>
              <TaskBuilderManager
                initial={{
                  task_type: editingTask.task_type,
                  points: editingTask.points,
                  question: editingTask.question,
                  lesson_id: editingTask.lesson_id,
                  extra_data: mapTaskToBuilderInitial(editingTask),
                }}
                taskId={editingTask.id}
                lessonId={editingTask.lesson_id}
                refetch={refetch}
                onClose={() => setEditOpen(false)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Task?"
        description="This action cannot be undone. The class will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        destructive
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingId(null);
        }}
        onConfirm={() => {
          if (deletingId != null) deleteMutation.mutate(deletingId);
        }}
      />
    </div>
  );
}
