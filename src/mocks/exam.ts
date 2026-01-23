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

