import React, { useEffect, useState } from 'react';
import type { TaskType, DragDropExtraData, MatchingExtraData, ParagraphDropdownData } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImage } from '@/services/courseExamService';
import { toast } from 'sonner';
import { LessonTaskQuill } from '@/components/ui/lesson-task-quill';
import { createCourseExamQuestion, updateCourseExamQuestion } from '@/services/courseExamQuestionService';
import type { CourseExamQuestionType, CourseExamQuestionPayloadType } from '@/types/courseexamquestion';
import { mapTaskToBuilderInitial } from '@/helper/mapTaskToBuilderInitial';
import RenderBuilder from '../builders/RenderBuilder';
import { useNavigate } from 'react-router-dom';

interface CourseExamQuestionFormProps {
  editingItem?: CourseExamQuestionType | null;
  sectionId?: number;
}

export function CourseExamQuestionForm({ editingItem = null, sectionId }: CourseExamQuestionFormProps) {
  const queryClient = useQueryClient();
  const [taskType, setTaskType] = useState<TaskType>('long');
  const [points, setPoints] = useState<number>(1);
  const [question, setQuestion] = useState('');
  const [extraData, setExtraData] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (editingItem) {
      setTaskType(editingItem.task_type as TaskType);
      setPoints(editingItem.points);
      setQuestion(editingItem.question || '');
      setExtraData(mapTaskToBuilderInitial(editingItem));
    } else {
      // Reset for create mode
      setTaskType('long');
      setPoints(1);
      setQuestion('');
      setExtraData({});
    }
  }, [editingItem]);

  useEffect(() => {
    if (taskType === 'paragraph_drag') {
      setExtraData({
        paragraph: '',
        blanks: [],
        answers: [],
      });
    }

    if (taskType === 'drag_drop') {
      setExtraData({ items: [], targets: [] });
    }

    if (taskType === 'matching') {
      setExtraData({ left: [], right: [] });
    }
  }, [taskType]);

  const createMutation = useMutation({
    mutationFn: createCourseExamQuestion,
    onSuccess: async () => {
      toast.success('Question created successfully');
      await queryClient.invalidateQueries({ queryKey: ['courseExamQuestions'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create question!'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CourseExamQuestionPayloadType }) => updateCourseExamQuestion(id, payload),
    onSuccess: async () => {
      toast.success('Question updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['courseExamQuestions'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update question!'),
  });

  const convertExtraToOptions = () => {
    if (taskType === 'drag_drop') {
      const d = extraData as DragDropExtraData;

      return [...d.items.map((t, i) => ({ option_text: t, pair_key: `I${i}` })), ...d.targets.map((t, i) => ({ option_text: t, pair_key: `T${i}` }))];
    }

    if (taskType === 'table_drag') {
      const t = extraData as { items: string[]; rows: { id: string; claim: string; evidences: string[] }[] };
      
      const output: any[] = [];

      // Add items
      t.items.forEach((item, i) => {
        output.push({
          option_text: item,
          pair_key: `I${i}`,
        });
      });

      // Add rows (claims and evidences)
      t.rows.forEach((row) => {
        // Add claim
        output.push({
          option_text: row.claim,
          pair_key: `R-${row.id}-C-0`,
        });

        // Add evidences
        row.evidences.forEach((evidence, evIndex) => {
          output.push({
            option_text: evidence,
            pair_key: `R-${row.id}-E-${evIndex}`,
          });
        });
      });

      return output;
    }

    if (taskType === 'character_web') {
      const c = extraData as { center_label: string; targets: { text: string; is_correct: number }[] };
      
      const output: any[] = [];

      // Add center label
      output.push({
        option_text: c.center_label,
        pair_key: 'center',
      });

      // Add targets
      c.targets.forEach((target, i) => {
        output.push({
          option_text: target.text,
          pair_key: `T${i}`,
          is_correct: target.is_correct === 1,
        });
      });

      return output;
    }

    if (taskType === 'fill_blank') {
      return [];
    }

    if (taskType === 'matching') {
      const m = extraData as MatchingExtraData;

      const output: any[] = [];

      m.left.forEach((leftItem, i) => {
        output.push({
          option_text: leftItem,
          pair_key: String(i + 1),
        });
      });

      m.right.forEach((rightItem, i) => {
        output.push({
          option_text: rightItem,
          pair_key: String(i + 1),
        });
      });

      return output;
    }

    if (taskType === 'long') {
      return [];
    }

    if (taskType === 'short') {
      return [];
    }

    if (taskType === 'mcq') {
      const mcq = extraData as {
        question: string;
        options: { option_text: string; is_correct: boolean }[];
      };

      return mcq.options.map((opt) => ({
        option_text: opt.option_text,
        is_correct: opt.is_correct,
      }));
    }

    if (taskType === 'true_false') {
      return [];
    }

    if (taskType === 'paragraph_drag') {
      const p = extraData as ParagraphDropdownData;
      const output: any[] = [];

      p.blanks.forEach((blank) => {
        blank.options.forEach((opt) => {
          if (!opt || opt.trim() === '') return;
          output.push({
            option_text: opt,
            pair_key: blank.id,
            is_correct: opt === blank.correct,
          });
        });
      });

      return output;
    }

    return [];
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CourseExamQuestionPayloadType = {
      section_id: editingItem ? editingItem?.section?.id : sectionId,
      question: taskType === 'paragraph_drag' ? extraData.paragraph : question,
      task_type: taskType,
      correct_answer: extraData.correct_answer ?? null,
      points,
      order: editingItem?.order || 1,
      extra_data: taskType == 'long' ? extraData : taskType === 'paragraph_drag' || taskType === 'drag_drop' || taskType === 'matching' ? extraData : undefined,
      options: convertExtraToOptions(),
    };

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="px-6 py-4 ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
        <div className="col-span-2">
          <Label htmlFor="task_type" className="text-sm font-medium">
            Task Type <span className="text-destructive">*</span>
          </Label>
          <Select key={taskType} value={taskType} onValueChange={(v) => setTaskType(v as TaskType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long Question</SelectItem>
              <SelectItem value="short">Short Question</SelectItem>
              <SelectItem value="mcq">Multiple Choice Question</SelectItem>
              <SelectItem value="fill_blank">Fill-in-the-Blank</SelectItem>
              <SelectItem value="true_false">True False</SelectItem>
              <SelectItem value="paragraph_drag">Paragraph Select</SelectItem>
              <SelectItem value="drag_drop">Drag & Drop</SelectItem>
              <SelectItem value='table_drag'>Table Drag & Drop</SelectItem>
              <SelectItem value='character_web'>Character Drag</SelectItem>
              <SelectItem value="matching">Matching</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="points" className="text-sm font-medium">
            Points <span className="text-destructive">*</span>
          </Label>
          <Input id="points" type="number" min="1" value={points} onChange={(e) => setPoints(Number(e.target.value))} required className="h-10.5" />
        </div>

        <div className="col-span-4">
          {taskType === 'paragraph_drag' ? null : (
            <>
              <Label htmlFor="question" className="text-sm font-medium">
                Question <span className="text-destructive">*</span>
              </Label>
              <div className="rounded-xl border bg-transparent border-gray-50 focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
                <LessonTaskQuill value={question} onChange={setQuestion} uploadFn={uploadImage} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* BUILDER */}
      <div className="border rounded p-4 bg-gray-50 mt-6">{RenderBuilder(taskType, extraData, setExtraData)}</div>

      <div className="flex items-center gap-3 justify-end mt-5 pt-6">
        <Button variant="outline" type="button" onClick={() => navigate(-1)} disabled={isLoading} className="min-w-24">
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isLoading} className="min-w-32 rounded-md">
          {isLoading ? 'Saving...' : editingItem ? 'Update Question' : 'Create Question'}
        </Button>
      </div>
    </div>
  );
}
