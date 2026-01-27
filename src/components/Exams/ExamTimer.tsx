import { getTimerColor } from '@/mocks/exam';
import { formatTime } from '@/utils/format';
import { Clock } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';
import { useEffect, useState } from 'react';

interface ExamTimerProps {
  currentSectionName: string;
}

export default function ExamTimer({ currentSectionName }: ExamTimerProps) {
  const { timerState } = useTimer();
  const { examTimeRemaining, sectionTimeRemaining, totalExamDuration, currentSectionDuration } = timerState;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.5;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const examColorClass = getTimerColor(examTimeRemaining, totalExamDuration);
  const sectionColorClass = getTimerColor(sectionTimeRemaining, currentSectionDuration);

  return (
    <div className={`mx-auto  flex justify-center gap-3 w-full transition-transform duration-300 ${isScrolled ? 'translate-y-0 fixed top-10 z-50 bg-white/50 rounded-xl p-3 ' : ''}`}>
      {/* Exam Timer */}
      <div className={`px-4 py-2  ${isScrolled ? 'w-auto' : 'w-full'} rounded-lg border-2 shadow-lg ${examColorClass} transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <Clock className="size-5" />
          <div>
            <p className="text-xs font-medium opacity-80">Total Time</p>
            <p className="text-sm font-bold tabular-nums">{formatTime(examTimeRemaining)}</p>
          </div>
        </div>
      </div>

      {/* Section Timer */}
      <div className={`px-4 py-2   ${isScrolled ? 'w-auto' : 'w-full'} rounded-lg border-2 shadow-lg ${sectionColorClass} transition-colors duration-300`}>
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
}
