import type { TaskType } from '@/types/task';

export const TASK_TITLE: Record<TaskType, string> = {
  mcq: 'Multiple Choice Question',
  short: 'Short Answer',
  long: 'Long Answer',
  drag_drop: 'Drag and Drop',
  matching: 'Matching',
  fill_blank: 'Fill in the Blanks',
  true_false: 'True or False',
  paragraph_drag: 'Paragraph Reading',
  table_drag: 'Table Drag Drop',
  character_web: 'Character Drag Drop',
};

export const getPerformanceMessage = (percentage: number) => {
  if (percentage >= 90) return { text: 'Outstanding Performance ! ', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
  if (percentage >= 75) return { text: 'Great Job !', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
  if (percentage >= 50) return { text: 'Good Effort !', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
  return { text: 'Keep Practicing !', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
};

export const getScoreColor = (score: number, total: any) => {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (percentage >= 50) return 'text-blue-600 bg-blue-50 border-blue-200';
  return 'text-amber-600 bg-amber-50 border-amber-200';
};

export const getScoreBarColor = (score: number, total: any) => {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return 'bg-emerald-500';
  if (percentage >= 50) return 'bg-blue-500';
  return 'bg-amber-500';
};

export const getPerformanceLabel = (score: number, total: any) => {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 50) return 'Good';
  return 'Needs Support';
};
