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