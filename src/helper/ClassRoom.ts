import type { ClassRoomType } from '@/types/class';

export const getTodayClasses = (classes: ClassRoomType[]) => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const dayShortNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayShort = dayShortNames[today.getDay()];

  return classes.filter((cls) => {
    const startDate = new Date(cls.start);
    const endDate = new Date(cls.end);
    const currentDate = new Date(todayString);

    return currentDate >= startDate && currentDate <= endDate && cls.days.includes(todayShort);
  });
};

export const getUpcomingClasses = (classes: ClassRoomType[]) => {
  const now = new Date();

  return classes
    .filter((cls) => new Date(cls.end) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);
};
