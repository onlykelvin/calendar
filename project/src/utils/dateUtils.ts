export const getMonthData = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startingDayIndex = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  const days: (Date | null)[] = Array(42).fill(null);
  
  for (let i = 0; i < daysInMonth; i++) {
    days[startingDayIndex + i] = new Date(year, month, i + 1);
  }
  
  return { days, month, year };
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};