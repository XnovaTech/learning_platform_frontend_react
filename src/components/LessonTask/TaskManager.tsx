import React, { useState } from 'react';

import { DragDropBuilder, FillBlankBuilder, MatchingBuilder, ShortAnswerBuilder, LongAnswerBuilder, McqBuilder, TrueFalseBuilder } from '@components/builders';

import type { TaskType, DragDropExtraData, MatchingExtraData, CreateLessonTaskPayloadType } from '@/types/task';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLessonTask } from '@/services/lessonTaskService';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label';

type Props = {
  initial?: CreateLessonTaskPayloadType | null;
  lessonId: number | undefined;
  refetch: () => Promise<any>;
};

export default function TaskBuilderManager({ initial, lessonId, refetch }: Props) {
  const queryClient = useQueryClient();

  const [type, setType] = useState<TaskType>(initial?.task_type ?? 'drag_drop');
  const [points, setPoints] = useState<number>(initial?.points ?? 1);
  // const [order, setOrder] = useState<number>(initial?.order ?? 1);

  // from builders
  const [extraData, setExtraData] = useState<any>(initial?.extra_data ?? {});

  const createMutation = useMutation({
    mutationFn: createLessonTask,
    onSuccess: async () => {
      toast.success('Task Created Successfully');
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      refetch();
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to create task');
    },
  });

  //  convert builder data → API "options[]" format
  const convertExtraToOptions = () => {
    if (type === 'drag_drop') {
      const d = extraData as DragDropExtraData;

      return [...d.items.map((t, i) => ({ option_text: t, pair_key: `I${i}` })), ...d.targets.map((t, i) => ({ option_text: t, pair_key: `T${i}` }))];
    }

    if (type === 'fill_blank') {
      return [];
    }

    if (type === 'matching') {
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

    if (type === 'long') {
      return [];
    }

    if (type === 'short') {
      return [];
    }

    if (type === 'mcq') {
      const mcq = extraData as {
        question: string;
        options: { option_text: string; is_correct: boolean }[];
      };

      return mcq.options.map((opt) => ({
        option_text: opt.option_text,
        is_correct: opt.is_correct,
      }));
    }

    if (type === 'true_false') {
      return [];
    }

    return [];
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateLessonTaskPayloadType = {
      lesson_id: Number(lessonId),
      task_type: type,
      question: extraData.question,
      correct_answer: extraData.correct_answer ?? null,
      extra_data: type === 'long' ? extraData.extra_data : undefined,
      points,
      order: 1,
      options: convertExtraToOptions(),
    };

    await createMutation.mutateAsync(payload);
  };

  const renderBuilder = () => {
    switch (type) {
      case 'drag_drop':
        return <DragDropBuilder initial={extraData as DragDropExtraData} onChange={setExtraData} />;

      case 'fill_blank':
        return <FillBlankBuilder onChange={setExtraData} />;

      case 'matching':
        return <MatchingBuilder initial={extraData as MatchingExtraData} onChange={setExtraData} />;

      case 'long':
        return <LongAnswerBuilder initial={extraData} onChange={setExtraData} />;

      case 'short':
        return <ShortAnswerBuilder initial={extraData} onChange={setExtraData} />;

      case 'mcq':
        return <McqBuilder initial={extraData} onChange={setExtraData} />;

      case 'true_false':
        return <TrueFalseBuilder initial={extraData} onChange={setExtraData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 p-5 border rounded bg-white shadow">
      {/* POINTS + ORDER */}
      <div className="grid grid-cols-4 gap-3">
        {/* TYPE */}
        <div className=" col-span-3">
          <Label className="font-medium mb-2">Task Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drag_drop">Drag & Drop</SelectItem>
              <SelectItem value="fill_blank">Fill-in-the-Blank</SelectItem>
              <SelectItem value="matching">Matching</SelectItem>
              <SelectItem value="long">Long Question</SelectItem>
              <SelectItem value="short">Short Question</SelectItem>
              <SelectItem value="mcq">Multiple Choice Question</SelectItem>
              <SelectItem value="true_false">True False</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label className="font-medium mb-3">Marks</Label>
          <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
        </div>

        {/* <div>
          <Label className="font-medium mb-2">Task Order</Label>
          <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
        </div> */}
      </div>

      {/* BUILDER */}
      <div className="border rounded p-4 bg-gray-50">{renderBuilder()}</div>

      <Button type="submit" className="w-full" onClick={onSubmit}>
        Save Task
      </Button>
    </div>
  );
}
