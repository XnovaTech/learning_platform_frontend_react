import type {
  LessonTaskType,
  DragDropExtraData,
  MatchingExtraData,
} from '@/types/task';

export function mapTaskToBuilderInitial(task: LessonTaskType) {
  switch (task.task_type) {
    case 'mcq':
      return {
        options: task.options?.map((o) => ({
          option_text: o.option_text,
          is_correct: o.is_correct,
        })) ?? [],
      };

    case 'true_false':
      return {
        correct_answer: task.correct_answer,
      };

    case 'short':
    case 'fill_blank':
      return {
        correct_answer: task.correct_answer ?? '',
      };

    case 'long':
      return {
        extra_data: task.extra_data,
      };

    case 'matching': {
      const left: string[] = [];
      const right: string[] = [];

      task.options?.forEach((opt) => {
        const index = Number(opt.pair_key) - 1;
        if (!left[index]) left[index] = '';
        if (!right[index]) right[index] = '';

        if (left[index] === '') left[index] = opt.option_text;
        else right[index] = opt.option_text;
      });

      return { left, right } as MatchingExtraData;
    }

    case 'drag_drop': {
      const items: string[] = [];
      const targets: string[] = [];

      task.options?.forEach((opt) => {
        if (opt.pair_key?.startsWith('I')) items.push(opt.option_text);
        if (opt.pair_key?.startsWith('T')) targets.push(opt.option_text);
      });

      return { items, targets } as DragDropExtraData;
    }

    default:
      return {};
  }
}
