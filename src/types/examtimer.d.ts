export interface TimerState {
  examTimeRemaining: number;
  sectionTimeRemaining: number;
  isExamExpired: boolean;
  isSectionExpired: boolean;
  totalExamDuration: number;
  currentSectionDuration: number;
  expiredSections: number[];
}

export interface StartTimerProps {
  totalExamDuration: number;
  sections: Array<{ id: number; duration: number }>;
  currentSectionIndex: number;
  enrollId: string | undefined;
  examType: string | undefined;
  onSectionTimeExpired: () => void;
  onExamTimeExpired: () => void;
}

export interface TimerActionsType {
  startTimer: (props: StartTimerProps) => void;
  stopTimer: () => void;
  resetSectionTimer: (currentSectionIndex: number, sections: Array<{ id: number; duration: number }>) => void;
  clearTimerData: () => void;
  resetSectionTimer: (currentSectionIndex: number, sections: Array<{ id: number; duration: number }>) => void;
  clearTimerData: () => void;
}