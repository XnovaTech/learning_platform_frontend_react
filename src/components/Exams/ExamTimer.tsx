import { memo } from 'react';
import { getTimerColor } from '@/mocks/exam';
import { formatTime } from '@/utils/format';
import { Clock } from 'lucide-react';
import { useTimerState } from '@/context/TimerContext';

interface ExamTimerProps {
  currentSectionName: string;
}

const ExamTimer = memo(function ExamTimer({ currentSectionName }: ExamTimerProps) {
  const timerState = useTimerState();
  const { examTimeRemaining, sectionTimeRemaining, totalExamDuration, currentSectionDuration } = timerState;
  const examColorClass = getTimerColor(examTimeRemaining, totalExamDuration);
  const sectionColorClass = getTimerColor(sectionTimeRemaining, currentSectionDuration);

  return (
    <div className={`mx-auto  flex justify-center gap-3 w-full transition-transform duration-300`}>
      {/* Exam Timer */}
      <div className={`px-4 py-2 w-full rounded-lg border-2 shadow-lg ${examColorClass} transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <Clock className="size-5" />
          <div>
            <p className="text-xs font-medium opacity-80">Total Time</p>
            <p className="text-sm font-bold tabular-nums">{formatTime(examTimeRemaining)}</p>
          </div>
        </div>
      </div>

      {/* Section Timer */}
      <div className={`px-4 py-2  w-full rounded-lg border-2 shadow-lg ${sectionColorClass} transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <Clock className="size-5" />
          <div>
            <p className="text-xs font-medium opacity-80">Section {currentSectionName}</p>
            <p className="text-sm font-bold tabular-nums">{formatTime(sectionTimeRemaining)}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ExamTimer;
