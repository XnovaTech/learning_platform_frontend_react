
export interface TimerState {
  examTimeRemaining: number;
  sectionTimeRemaining: number;
  isExamExpired: boolean;
  isSectionExpired: boolean;
  totalExamDuration: number;
  currentSectionDuration: number;
}


export interface UseExamTimerProps {
  totalExamDuration: number;
  sections: Array<{ id: number; duration: number }>;
  currentSectionIndex: number;
  onSectionTimeExpired: () => void;
  onExamTimeExpired: () => void;
  enrollId: string | undefined;
  examType: string | undefined;
  isStarted: boolean;
}
