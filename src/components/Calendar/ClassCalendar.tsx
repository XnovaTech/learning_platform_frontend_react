import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ClassRoomType } from '@/types/class';
import CalendarDetailBox from '@/components/Calendar/CalendarDetailBox';
import { DAYS_OF_WEEK, MONTH_NAMES } from '@/mocks/class';

const DAY_MAP: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

interface CalendarProps {
  classes: ClassRoomType[];
  isTeacher: boolean;
}

export default function ClassCalendar({ classes, isTeacher }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEventsForDate = (date: Date) => {
    const dayIndex = date.getDay();

    return classes.filter((cls) => {
      if (!cls.days || cls.days.length === 0) return false;
      const classStart = new Date(cls.start);
      const classEnd = new Date(cls.end);
      if (date < classStart || date > classEnd) return false;

      return cls.days.some((d) => DAY_MAP[d.toLowerCase()] === dayIndex);
    });
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }, [currentMonth, currentYear]);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <Select value={`${currentMonth}`} onValueChange={(value) => setCurrentMonth(parseInt(value))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((month, index) => (
                <SelectItem key={index} value={`${index}`}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-3">
            <h2 className=" font-medium">
              {MONTH_NAMES[currentMonth].slice(0, 3)} {currentYear}
            </h2>
            
            <Button onClick={goToPreviousMonth} className="hover:scale-100 rounded-md" size="sm">
              <ChevronLeft className="h-3 w-3" />
            </Button>

            <Button onClick={goToNextMonth} className="hover:scale-100 rounded-md" size="sm">
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Week */}
        <div className="grid grid-cols-7 gap-2 border-b border-b-gray-300 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center font-semibold  text-slate-700  text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* date  */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="min-h-26" />;
            }

            const events = getEventsForDate(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  relative min-h-28 border border-gray-300 rounded-lg p-2 cursor-pointer
                  transition-all hover:border-primary hover:shadow-md
                  ${events.length > 0 ? 'bg-primary/5 border-primary/20' : 'bg-white'}
                  ${isTodayDate ? 'ring-2 ring-primary' : ''}
                `}
              >
                <span
                  className={`
                    text-sm font-semibold
                    ${isTodayDate ? 'bg-primary text-white rounded-sm px-2 py-1' : 'text-slate-700'}
                  `}
                >
                  {date.getDate()}
                </span>

                {events.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {events?.slice(0, 2)?.map((event, idx) => (
                      <div key={idx} className="text-xs bg-primary/90 text-white rounded-sm px-1.5 py-0.5 truncate font-medium hover:bg-primary/100 transition-colors">
                        {event?.course?.category?.name || ''} - {event.class_name}
                      </div>
                    ))}

                    {events?.length > 2 && (
                      <Button type="button" variant="ghost" size="sm" className="w-full h-auto p-1 text-xs text-primary hover:bg-primary/10 font-medium">
                        more +
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* detail */}
      <CalendarDetailBox isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} date={selectedDate} events={selectedDate ? getEventsForDate(selectedDate) : []} isTeacher={isTeacher} />
    </>
  );
}
