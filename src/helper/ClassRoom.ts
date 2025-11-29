export const formatDaysRange = (days: string[]): string => {
  if (!days || days.length === 0) return '';

  const sortedDays = days.sort((a, b) => {
    return a.localeCompare(b);
  });

  return `${sortedDays[0]} to ${sortedDays[sortedDays.length - 1]}`;
};
