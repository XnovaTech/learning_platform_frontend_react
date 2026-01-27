import type { CourseExamQuestionType } from '@/types/courseexamquestion';
import type {
  LessonTaskType ,
  DragDropExtraData,
  MatchingExtraData,
  ParagraphDropdownData,
} from '@/types/task';

export function mapTaskToBuilderInitial(task: LessonTaskType | CourseExamQuestionType ) {
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
      return task.extra_data || {};

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

    case 'paragraph_drag': {
      const blanksMap: Record<string, ParagraphDropdownData['blanks'][0]> = {};
      task.options?.forEach((opt: any) => {
        const blankId = opt.pair_key;
        if (!blankId) return;

        if (!blanksMap[blankId]){
          blanksMap[blankId] = {
            id: blankId,
            options: [],
            correct: '',
          };
        }

        blanksMap[blankId].options.push(opt.option_text);

        if (opt.is_correct) {
          blanksMap[blankId].correct = opt.option_text;
        }
      });

      return {
        paragraph: task.question ?? '',
        blanks: Object.values(blanksMap),
      };
    
    }

    case 'table_drag': {
      const items: string[] = [];
      const rows: { id: string; claim: string; evidences: string[] }[] = [];

      task.options?.forEach((opt) => {
        if (opt.pair_key?.startsWith('I')) {
          items.push(opt.option_text);
        } else if (opt.pair_key?.startsWith('R')) {
          // Format: R-{rowId}-{type}-{index}
          // type: 'C' for claim, 'E' for evidence
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
            // Ensure evidences array has enough space
            const evIndex = Number(index);
            while (row.evidences.length <= evIndex) {
              row.evidences.push('');
            }
            row.evidences[evIndex] = opt.option_text;
          }
        }
      });

      return { items, rows };
    }

    case 'character_web': {
      const options = task.options || [];
      const center_label = options.find((opt) => opt.pair_key === 'center')?.option_text || '';
      const targets = options
        .filter((opt) => opt.pair_key?.startsWith('T'))
        .sort((a, b) => Number(a.pair_key?.replace('T', '')) - Number(b.pair_key?.replace('T', '')))
        .map((opt) => ({ text: opt.option_text, is_correct: opt.is_correct ? 1 : 0 }));

      return { center_label, targets };
    }

    default:
      return {};
  }
}
