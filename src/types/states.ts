import { DayItem } from '@/models'

export interface RootState {
  dayItems: {
    all: DayItem[],
    previous: DayItem | null,
    current: DayItem | null,
    next: DayItem | null
  },
  transport: {
    autoplay: boolean
  }
}
