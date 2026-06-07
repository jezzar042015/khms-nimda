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
                <div v-for="day in calendarDays" :key="day.key"
                    class="relative min-h-14 p-0.5 rounded overflow-hidden cursor-pointer"
                    @click="setTargetDay(day.key)" :class="{
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
                        <div class="font-semibold text-sm text-center">
                            <span v-if="day.histories.length" class="h-8 w-8">
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
    import { computed } from 'vue'
    import { useHistoryStore } from '@/stores/history'
    import { usePageStore } from '@/stores/pages'
    import type { CalendarDay, GroupedDaily, TrackedData } from '@/types/history'

    const props = defineProps<{
        month: string
        tracked: GroupedDaily[]
    }>()

    const history = useHistoryStore()
    const pages = usePageStore()

    const daysLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    const [yearStr, monthStr] = props.month.split('-')
    const year = Number(yearStr)
    const monthIndex = Number(monthStr) - 1

    const monthName = new Date(year, monthIndex).toLocaleString('en-US', {
        month: 'long',
    })

    const today = new Date()

    const setTargetDay = (targetDay: string) => {
        history.targetDay = targetDay.replace('curr-', '')
        pages.modal = 'calendar-day-details'
    }

    const formatDateKey = (date: Date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')

        return `${y}-${m}-${d}`
    }

    const historiesByDate = computed(() => {
        const map = new Map<string, TrackedData[]>()

        for (const day of props.tracked) {
            map.set(day.day, day.tracked)
        }

        return map
    })

    const calendarDays = computed<CalendarDay[]>(() => {
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
                histories: historiesByDate.value.get(key) ?? [],
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
                histories: historiesByDate.value.get(key) ?? [],
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
                histories: historiesByDate.value.get(key) ?? [],
            })
        }

        return result
    })

    const maxVolume = computed(() =>
        Math.max(
            1,
            ...calendarDays.value.map(day => day.histories.length),
        ),
    )

    const getFillPercent = (count: number) => {
        return (count / maxVolume.value) * 100
    }
</script>