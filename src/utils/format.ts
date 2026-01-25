import moment from 'moment';


export const formatDaysRange = (days: string[]): string => {
  if (!days || days.length === 0) return '';

  const sortedDays = days.sort((a, b) => a.localeCompare(b));
  return `${sortedDays[0]} to ${sortedDays[sortedDays.length - 1]}`;
};


export const displayTime = (time: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  if (!hours || !minutes) return '';
  return `${parseInt(hours, 10)}:${minutes.padStart(2, '0')}`;
};


export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return moment(date).format('D.M.YYYY');
};


export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
