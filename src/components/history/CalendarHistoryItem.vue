<template>
    <div class="py-2 text-sm">
        <div class="p-3">

            <!-- Header -->
            <div class="flex justify-center items-center mb-4">
                <div class="font-bold">
                    {{ monthName }} {{ year }}
                </div>
            </div>

            <!-- Days Label -->
            <div class="grid grid-cols-7 rounded bg-amber-500 py-1">
                <div v-for="day in daysLabel" :key="day" class="text-white py-1 text-center font-medium">
                    {{ day }}
                </div>
            </div>

            <!-- Calendar -->
            <div class="grid grid-cols-7 gap-1 mt-1">
                <div v-for="day in calendarDays" :key="day.key" class="relative min-h-14 p-0.5 rounded overflow-hidden"
                    :class="{
                        'text-gray-400': !day.currentMonth && day.histories.length === 0,
                        'ring-2 ring-amber-500': day.isToday,
                        'bg-gray-50': day.histories.length === 0,
                        'border border-amber-500': day.histories.length > 0
                    }">
                    <!-- Heat Fill -->
                    <div class="absolute bottom-0 left-0 right-0 bg-amber-500 opacity-80"
                        :style="{ height: getFillPercent(day.histories.length) + '%' }" />

                    <!-- Content -->
                    <div class="relative z-10 h-full flex flex-col justify-between">

                        <!-- Day -->
                        <div class="text-xs text-center font-medium p-0.5">
                            {{ day.day }}
                        </div>

                        <!-- Volume -->
                        <div class="font-semibold text-sm text-center bor">
                            <span class="h-8 w-8" v-if="day.histories.length">
                                {{ day.histories.length }}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
    import type { TrackedData } from '@/types/history'

    interface GroupedMonthly {
        month: string // YYYY-MM
        tracked: {
            day: string // YYYY-MM-DD
            tracked: TrackedData[]
        }[]
    }

    const props = defineProps<GroupedMonthly>()

    const daysLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    const [yearStr, monthStr] = props.month.split('-')
    const year = Number(yearStr)
    const monthIndex = Number(monthStr) - 1

    const monthName = new Date(year, monthIndex).toLocaleString('en-US', {
        month: 'long',
    })

    const today = new Date()

    const formatDateKey = (date: Date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    const historiesByDate = new Map<string, TrackedData[]>()

    for (const d of props.tracked) {
        historiesByDate.set(d.day, d.tracked)
    }

    /**
     * Calendar day type
     */
    interface CalendarDay {
        key: string
        day: number
        currentMonth: boolean
        isToday: boolean
        date: Date
        histories: TrackedData[]
    }

    /**
     * Build calendar grid
     */
    const calendarDays: CalendarDay[] = (() => {
        const result: CalendarDay[] = []

        const firstDay = new Date(year, monthIndex, 1)
        const firstWeekday = firstDay.getDay()

        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
        const daysInPrevMonth = new Date(year, monthIndex, 0).getDate()

        // Previous month padding
        for (let i = firstWeekday - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i
            const date = new Date(year, monthIndex - 1, day)
            const key = formatDateKey(date)

            result.push({
                key: `prev-${key}`,
                day,
                currentMonth: false,
                isToday: false,
                date,
                histories: historiesByDate.get(key) ?? [],
            })
        }

        // Current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthIndex, day)
            const key = formatDateKey(date)

            result.push({
                key: `curr-${key}`,
                day,
                currentMonth: true,
                isToday:
                    date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth() &&
                    date.getDate() === today.getDate(),
                date,
                histories: historiesByDate.get(key) ?? [],
            })
        }

        // Next month padding
        const remaining = (7 - (result.length % 7)) % 7

        for (let day = 1; day <= remaining; day++) {
            const date = new Date(year, monthIndex + 1, day)
            const key = formatDateKey(date)

            result.push({
                key: `next-${key}`,
                day,
                currentMonth: false,
                isToday: false,
                date,
                histories: historiesByDate.get(key) ?? [],
            })
        }

        return result
    })()

    /**
     * Max volume for heat scaling
     */
    const maxVolume = Math.max(
        1,
        ...calendarDays.map(d => d.histories.length),
    )

    /**
     * Convert count → percentage height
     */
    const getFillPercent = (count: number) => {
        return (count / maxVolume) * 100
    }
</script>