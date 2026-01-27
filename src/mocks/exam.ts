import { Clock, Trophy } from "lucide-react";

export const examTypes = [
  {
    type: 'Midterm',
    icon: Clock,
    description: 'Mid-course assessment to evaluate student progress',
    color: 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100 text-blue-700',
  },
  {
    type: 'Final',
    icon: Trophy,
    description: 'Comprehensive end-of-course examination',
    color: 'bg-amber-50 border-amber-100 hover:bg-amber-100 text-amber-700',
  },
];


export const examSections = ['1', '2', '3', '4', '5','Break'];

 export const getTimerColor = (remaining: number, total: number): string => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 10) return 'text-red-600 bg-red-50 border-red-200';
    if (percentage <= 25) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-primary bg-primary/10 border-primary/20';
  };