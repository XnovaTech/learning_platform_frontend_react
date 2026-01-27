import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

interface TimerState {
  examTimeRemaining: number;
  sectionTimeRemaining: number;
  isExamExpired: boolean;
  isSectionExpired: boolean;
  totalExamDuration: number;
  currentSectionDuration: number;
}

interface StartTimerProps {
  totalExamDuration: number;
  sections: Array<{ id: number; duration: number }>;
  currentSectionIndex: number;
  enrollId: string | undefined;
  examType: string | undefined;
  onSectionTimeExpired: () => void;
  onExamTimeExpired: () => void;
}

interface TimerContextType {
  timerState: TimerState;
  startTimer: (props: StartTimerProps) => void;
  stopTimer: () => void;
  resetSectionTimer: (currentSectionIndex: number, sections: Array<{ id: number; duration: number }>) => void;
  clearTimerData: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used within TimerProvider');
  return ctx;
};

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timerState, setTimerState] = useState<TimerState>({
    examTimeRemaining: 0,
    sectionTimeRemaining: 0,
    isExamExpired: false,
    isSectionExpired: false,
    totalExamDuration: 0,
    currentSectionDuration: 0,
  });

  const intervalRef = useRef<number | null>(null);

  const examStartRef = useRef<number | null>(null);
  const sectionStartRef = useRef<number | null>(null);
  const sectionIndexRef = useRef<number>(0);
  const storageKeyRef = useRef<string>('');

  const callbacksRef = useRef({
    onSectionTimeExpired: () => {},
    onExamTimeExpired: () => {},
  });

  const persistTimer = useCallback(() => {
    if (!storageKeyRef.current || !examStartRef.current || !sectionStartRef.current) return;

    localStorage.setItem(
      storageKeyRef.current,
      JSON.stringify({
        examStartTime: examStartRef.current,
        sectionStartTime: sectionStartRef.current,
        currentSectionIndex: sectionIndexRef.current,
      }),
    );
  }, []);

  // Start / Resume Timer
  const startTimer = useCallback(
    ({ totalExamDuration, sections, currentSectionIndex, enrollId, examType, onSectionTimeExpired, onExamTimeExpired }: StartTimerProps) => {
      if (!enrollId || !examType) return;

      callbacksRef.current = { onSectionTimeExpired, onExamTimeExpired };
      storageKeyRef.current = `exam-timer-${enrollId}-${examType}`;
      sectionIndexRef.current = currentSectionIndex;

      // Cleanup
      intervalRef.current && clearInterval(intervalRef.current);

      const now = Date.now();
      const saved = localStorage.getItem(storageKeyRef.current);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const examElapsed = Math.floor((now - parsed.examStartTime) / 1000);
          const sectionElapsed = Math.floor((now - parsed.sectionStartTime) / 1000);

          const examRemaining = Math.max(0, totalExamDuration * 60 - examElapsed);
          const sectionIdx = parsed.currentSectionIndex ?? currentSectionIndex;
          const sectionRemaining = Math.max(0, sections[sectionIdx]?.duration * 60 - sectionElapsed);

          examStartRef.current = parsed.examStartTime;
          sectionStartRef.current = parsed.sectionStartTime;
          sectionIndexRef.current = sectionIdx;

          setTimerState({
            examTimeRemaining: examRemaining,
            sectionTimeRemaining: sectionRemaining,
            isExamExpired: examRemaining === 0,
            isSectionExpired: sectionRemaining === 0,
            totalExamDuration: totalExamDuration * 60,
            currentSectionDuration: sections[sectionIdx]?.duration * 60 || 0,
          });
        } catch {
          initializeTimer(totalExamDuration, sections, currentSectionIndex);
        }
      } else {
        initializeTimer(totalExamDuration, sections, currentSectionIndex);
      }

      /* Tick every second */
      intervalRef.current = setInterval(() => {
        setTimerState((prev) => {
          const exam = Math.max(0, prev.examTimeRemaining - 1);
          const section = Math.max(0, prev.sectionTimeRemaining - 1);

          if (exam === 0 && !prev.isExamExpired) {
            toast.error('Exam time expired!');
            callbacksRef.current.onExamTimeExpired();
            return { ...prev, examTimeRemaining: 0, isExamExpired: true };
          }

          if (section === 0 && !prev.isSectionExpired) {
            toast.warning('Section time expired!');
            setTimeout(callbacksRef.current.onSectionTimeExpired, 1000);
            return { ...prev, sectionTimeRemaining: 0, isSectionExpired: true };
          }

          return {
            ...prev,
            examTimeRemaining: exam,
            sectionTimeRemaining: section,
          };
        });
      }, 1000);
    },
    [persistTimer],
  );

  /* ---------------------------------- */
  /* Initialize Fresh Exam              */
  /* ---------------------------------- */
  const initializeTimer = (totalExamDuration: number, sections: Array<{ id: number; duration: number }>, sectionIndex: number) => {
    const now = Date.now();
    examStartRef.current = now;
    sectionStartRef.current = now;
    sectionIndexRef.current = sectionIndex;

    setTimerState({
      examTimeRemaining: totalExamDuration * 60,
      sectionTimeRemaining: sections[sectionIndex]?.duration * 60 || 0,
      isExamExpired: false,
      isSectionExpired: false,
      totalExamDuration: totalExamDuration * 60,
      currentSectionDuration: sections[sectionIndex]?.duration * 60 || 0,
    });

    persistTimer();
  };

  // Reset Section Timer (navigation)
  const resetSectionTimer = useCallback(
    (index: number, sections: Array<{ id: number; duration: number }>) => {
      const duration = sections[index]?.duration * 60 || 0;
      sectionIndexRef.current = index;
      sectionStartRef.current = Date.now();

      setTimerState((prev) => ({
        ...prev,
        sectionTimeRemaining: duration,
        currentSectionDuration: duration,
        isSectionExpired: false,
      }));

      persistTimer();
    },
    [persistTimer],
  );

  // Stop / Clear 
  const stopTimer = useCallback(() => {
    intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  const clearTimerData = useCallback(() => {
    stopTimer();
    storageKeyRef.current && localStorage.removeItem(storageKeyRef.current);
    examStartRef.current = null;
    sectionStartRef.current = null;

    setTimerState({
      examTimeRemaining: 0,
      sectionTimeRemaining: 0,
      isExamExpired: false,
      isSectionExpired: false,
      totalExamDuration: 0,
      currentSectionDuration: 0,
    });
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  return (
    <TimerContext.Provider
      value={{
        timerState,
        startTimer,
        stopTimer,
        resetSectionTimer,
        clearTimerData,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
