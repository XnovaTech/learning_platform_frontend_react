import type { StartTimerProps, TimerActionsType, TimerState } from '@/types/examtimer';
import React, { createContext, useContext, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

const TimerStateContext = createContext<TimerState | undefined>(undefined);
const TimerActionsContext = createContext<TimerActionsType | undefined>(undefined);

export const useTimerState = () => {
  const ctx = useContext(TimerStateContext);
  if (!ctx) throw new Error('useTimerState must be used within TimerProvider');
  return ctx;
};

export const useTimerActions = () => {
  const ctx = useContext(TimerActionsContext);
  if (!ctx) throw new Error('useTimerActions must be used within TimerProvider');
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
    expiredSections: [],
  });
  const examExpiredFiredRef = useRef(false);
  const sectionExpiredFiredRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const examStartRef = useRef<number | null>(null);
  const sectionStartRef = useRef<number | null>(null);
  const sectionIndexRef = useRef<number>(0);
  const storageKeyRef = useRef<string>('');
  const expiredSectionsRef = useRef<number[]>([]);

  const callbacksRef = useRef({
    onSectionTimeExpired: () => {},
    onExamTimeExpired: () => {},
  });

  useEffect(() => {
    expiredSectionsRef.current = timerState.expiredSections;
  }, [timerState.expiredSections]);

  // persist timer whenever expiredSections changes
  useEffect(() => {
    if (storageKeyRef.current && timerState.expiredSections.length > 0) {
      const existingData = JSON.parse(localStorage.getItem(storageKeyRef.current) || '{}');
      localStorage.setItem(
        storageKeyRef.current,
        JSON.stringify({
          ...existingData,
          expiredSections: timerState.expiredSections,
        }),
      );
    }
  }, [timerState.expiredSections]);

  const persistTimer = useCallback(() => {
    if (!storageKeyRef.current || !examStartRef.current || !sectionStartRef.current) return;

    const existingData = JSON.parse(localStorage.getItem(storageKeyRef.current) || '{}');

    localStorage.setItem(
      storageKeyRef.current,
      JSON.stringify({
        ...existingData,
        examStartTime: examStartRef.current,
        [`sectionStart_${sectionIndexRef.current}`]: sectionStartRef.current,
        currentSectionIndex: sectionIndexRef.current,
        expiredSections: expiredSectionsRef.current,
      }),
    );
  }, []);

  // Start / Resume Timer
  const startTimer = useCallback(
    ({ totalExamDuration, sections, currentSectionIndex, enrollId, examType, onSectionTimeExpired, onExamTimeExpired }: StartTimerProps) => {
      examExpiredFiredRef.current = false;
      sectionExpiredFiredRef.current = false;
      if (!enrollId || !examType) return;

      callbacksRef.current = { onSectionTimeExpired, onExamTimeExpired };
      storageKeyRef.current = `exam-timer-${enrollId}-${examType}`;
      sectionIndexRef.current = currentSectionIndex;
      intervalRef.current && clearInterval(intervalRef.current);

      const now = Date.now();
      const saved = localStorage.getItem(storageKeyRef.current);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const examElapsed = Math.floor((now - parsed.examStartTime) / 1000);
          const sectionIdx = parsed.currentSectionIndex ?? currentSectionIndex;
          const sectionStartKey = `sectionStart_${sectionIdx}`;
          const savedSectionStartTime = parsed[sectionStartKey];

          // If no saved section start time, initialize fresh
          if (!savedSectionStartTime) {
            throw new Error('No section start time found');
          }

          const sectionElapsed = Math.floor((now - savedSectionStartTime) / 1000);
          const examRemaining = Math.max(0, totalExamDuration * 60 - examElapsed);
          const sectionRemaining = Math.max(0, sections[sectionIdx]?.duration * 60 - sectionElapsed);

          examStartRef.current = parsed.examStartTime;
          sectionStartRef.current = savedSectionStartTime;
          sectionIndexRef.current = sectionIdx;

          setTimerState({
            examTimeRemaining: examRemaining,
            sectionTimeRemaining: sectionRemaining,
            isExamExpired: examRemaining === 0,
            isSectionExpired: sectionRemaining === 0,
            totalExamDuration: totalExamDuration * 60,
            currentSectionDuration: sections[sectionIdx]?.duration * 60 || 0,
            expiredSections: parsed.expiredSections || [],
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

          if (exam === 0 && !examExpiredFiredRef.current) {
            examExpiredFiredRef.current = true;
            toast.error('Exam time expired!');
            callbacksRef.current.onExamTimeExpired();

            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            return { ...prev, examTimeRemaining: 0, isExamExpired: true };
          }

          const isLastSection = sectionIndexRef.current >= sections.length - 1;

          if (section === 0 && !sectionExpiredFiredRef.current) {
            sectionExpiredFiredRef.current = true;
            if (!isLastSection) {
              callbacksRef.current.onSectionTimeExpired();
            }

            return { ...prev, sectionTimeRemaining: 0, isSectionExpired: true, expiredSections: isLastSection ? prev.expiredSections : [...prev.expiredSections, sectionIndexRef.current] };
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

  /* Initialize Fresh Exam     */
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
      expiredSections: [],
    });

    persistTimer();
  };

  // Reset Section Timer
  const resetSectionTimer = useCallback((index: number, sections: Array<{ id: number; duration: number }>) => {
    const storageKey = storageKeyRef.current;
    const saved = localStorage.getItem(storageKey);
    const now = Date.now();

    let sectionStartTime = now;

    if (saved) {
      const parsed = JSON.parse(saved);
      const specificSectionKey = `sectionStart_${index}`;

      if (parsed[specificSectionKey]) {
        sectionStartTime = parsed[specificSectionKey];
      } else {
        parsed[specificSectionKey] = now;
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...parsed,
            currentSectionIndex: index,
          }),
        );
      }
    }

    sectionIndexRef.current = index;
    sectionStartRef.current = sectionStartTime;
    const sectionElapsed = Math.floor((now - sectionStartTime) / 1000);
    const duration = sections[index]?.duration * 60 || 0;
    const remaining = Math.max(0, duration - sectionElapsed);

    setTimerState((prev) => ({
      ...prev,
      sectionTimeRemaining: remaining,
      currentSectionDuration: duration,
      isSectionExpired: remaining === 0,
      expiredSections: remaining === 0 ? [...prev.expiredSections, index] : prev.expiredSections,
    }));
  }, []);

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
      expiredSections: [],
    });
  }, [stopTimer]);

  const actions = useMemo(
    () => ({
      startTimer,
      stopTimer,
      resetSectionTimer,
      clearTimerData,
    }),
    [startTimer, stopTimer, resetSectionTimer, clearTimerData],
  );

  return (
    <TimerStateContext.Provider value={timerState}>
      <TimerActionsContext.Provider value={actions}>{children}</TimerActionsContext.Provider>
    </TimerStateContext.Provider>
  );
};
