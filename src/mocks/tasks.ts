import type { TaskType } from "@/types/task";

export const TASK_TITLE: Record<TaskType, string> = {
  mcq: 'Multiple Choice Question',
  short: 'Short Answer',
  long: 'Long Answer',
  drag_drop: 'Drag and Drop',
  matching: 'Matching',
  fill_blank: 'Fill in the Blanks',
  true_false: 'True or False',
  paragraph_drag: 'Paragraph Reading'

};
