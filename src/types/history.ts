export interface TrackedData {
    ts: string
    cong: string
    lang: string
    classes: 1 | 2
}

export interface GroupedDaily {
    day: string
    tracked: TrackedData[]
}

export interface GroupedMonthly {
    month: string  //YYYY-MM 
    tracked: GroupedDaily[]
}

/**
  * Calendar day type
  */
export interface CalendarDay {
    key: string
    day: number
    currentMonth: boolean
    isToday: boolean
    date: Date
    histories: TrackedData[]
}
