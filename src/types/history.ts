export interface Congregation {
    cong: string
    lang: string
    classes: 1 | 2
    language?: string | null        
    latest: string
    visits: number
}

export interface TrackedData {
    ts: string
    cong: string
    lang: string
    classes: 1 | 2,
    time?: string,
    language?: string | null
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
