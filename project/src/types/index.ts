export interface DayData {
  note?: string;
  links?: string[];
  photos?: string[];
}

export interface CalendarData {
  [date: string]: DayData;
}