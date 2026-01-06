export const formatDaysRange = (days: string[]): string => {
  if (!days || days.length === 0) return '';

  const sortedDays = days.sort((a, b) => {
    return a.localeCompare(b);
  });

  return `${sortedDays[0]} to ${sortedDays[sortedDays.length - 1]}`;
};

export const  displayTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) return '';
    return `${parseInt(hours, 10)}:${minutes.padStart(2, '0')}`;
  };
