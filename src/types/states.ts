import { DayItem } from '@/models'

export interface RootState {
  dayItems: {
    all: DayItem[],
    selected: DayItem | null
  }
}
