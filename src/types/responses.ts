import type { TrackedData } from "./history"

export interface TrackedDataResponse {
    status: number
    data?: TrackedData[]
    timestamp: string
}