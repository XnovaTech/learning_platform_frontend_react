import type { TimerState, UseExamTimerProps } from '@/types/examtimer';
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export const useExamTimer = ({ totalExamDuration, sections, currentSectionIndex, onSectionTimeExpired, onExamTimeExpired, enrollId, examType, isStarted }: UseExamTimerProps) => {
  const [timerState, setTimerState] = useState<TimerState>({
    examTimeRemaining: totalExamDuration * 60,
    sectionTimeRemaining: sections[0]?.duration * 60 || 0,
    isExamExpired: false,
    isSectionExpired: false,
    totalExamDuration: totalExamDuration * 60,
    currentSectionDuration: sections[0]?.duration * 60 || 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const examStartTimeRef = useRef<number | null>(null);
  const sectionStartTimeRef = useRef<number | null>(null);
  const storageKey = `exam-timer-${enrollId}-${examType}`;

  // Load saved timer state
  useEffect(() => {
    if (!isStarted || !enrollId) return;

    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const now = Date.now();

        const examElapsed = Math.floor((now - parsed.examStartTime) / 1000);
        const sectionElapsed = Math.floor((now - parsed.sectionStartTime) / 1000);
        const examRemaining = Math.max(0, totalExamDuration * 60 - examElapsed);
        const sectionRemaining = Math.max(0, sections[currentSectionIndex]?.duration * 60 - sectionElapsed);

        setTimerState({
          examTimeRemaining: examRemaining,
          sectionTimeRemaining: sectionRemaining,
          isExamExpired: examRemaining === 0,
          isSectionExpired: sectionRemaining === 0,
          totalExamDuration: totalExamDuration * 60,
          currentSectionDuration: sections[currentSectionIndex]?.duration * 60 || 0,
        });

        examStartTimeRef.current = parsed.examStartTime;
        sectionStartTimeRef.current = parsed.sectionStartTime;
      } catch (error) {
        console.error('Failed to load timer state:', error);
        initializeTimer();
      }
    } else {
      initializeTimer();
    }
  }, [isStarted, enrollId, examType]);

  const initializeTimer = () => {
    const now = Date.now();
    examStartTimeRef.current = now;
    sectionStartTimeRef.current = now;

    setTimerState({
      examTimeRemaining: totalExamDuration * 60,
      sectionTimeRemaining: sections[currentSectionIndex]?.duration * 60 || 0,
      isExamExpired: false,
      isSectionExpired: false,
      totalExamDuration: totalExamDuration * 60,
      currentSectionDuration: sections[currentSectionIndex]?.duration * 60 || 0,
    });
  };

  // Save timer state
  const saveTimerState = useCallback(() => {
    if (!enrollId || !examStartTimeRef.current || !sectionStartTimeRef.current) return;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        examStartTime: examStartTimeRef.current,
        sectionStartTime: sectionStartTimeRef.current,
        currentSectionIndex,
      }),
    );
  }, [enrollId, storageKey, currentSectionIndex]);

  // Reset section timer when section changes
  useEffect(() => {
    if (!isStarted) return;

    const newSectionDuration = sections[currentSectionIndex]?.duration * 60 || 0;
    sectionStartTimeRef.current = Date.now();

    setTimerState((prev) => ({
      ...prev,
      sectionTimeRemaining: newSectionDuration,
      currentSectionDuration: newSectionDuration,
      isSectionExpired: false,
    }));

    saveTimerState();
  }, [currentSectionIndex, isStarted]);

  useEffect(() => {
    if (!isStarted) return;

    intervalRef.current = setInterval(() => {
      setTimerState((prev) => {
        const newExamTime = Math.max(0, prev.examTimeRemaining - 1);
        const newSectionTime = Math.max(0, prev.sectionTimeRemaining - 1);

        // Check exam expiration
        if (newExamTime === 0 && !prev.isExamExpired) {
          toast.error('Exam time has expired!');
          onExamTimeExpired();
          return {
            ...prev,
            examTimeRemaining: 0,
            isExamExpired: true,
          };
        }

        // Check section expiration
        if (newSectionTime === 0 && !prev.isSectionExpired) {
          toast.warning('Section time has expired. Moving to next section...');
          setTimeout(() => onSectionTimeExpired(), 1500);
          return {
            ...prev,
            sectionTimeRemaining: 0,
            isSectionExpired: true,
          };
        }

        // Warning notifications
        if (newExamTime === 300 && prev.examTimeRemaining > 300) {
          toast.warning('5 minutes remaining for the entire exam!');
        }

        if (newSectionTime === 60 && prev.sectionTimeRemaining > 60) {
          toast.warning('1 minute remaining for this section!');
        }

        return {
          ...prev,
          examTimeRemaining: newExamTime,
          sectionTimeRemaining: newSectionTime,
        };
      });

      saveTimerState();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStarted, onExamTimeExpired, onSectionTimeExpired, saveTimerState]);

  const clearTimerData = useCallback(() => {
    localStorage.removeItem(storageKey);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [storageKey]);

  return {
    ...timerState,
    clearTimerData,
  };
};
