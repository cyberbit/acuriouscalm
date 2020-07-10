export interface DayItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  audio?: string;
  image?: string;
}

export const generateEmptyDayItem = (): DayItem => ({
  id: '',
  title: 'Unknown Title'
})
