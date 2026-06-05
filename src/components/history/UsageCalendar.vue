<template>
    <div class="py-2 text-sm">
        <div class="border bg-gray-100 border-gray-100 p-3">
            <div class="flex justify-between items-center mb-4">
                <button
                    class="bg-white px-2 py-1 rounded-md cursor-pointer shadow"
                    @click="previous"
                >
                    <CaretIcon class="h-6 w-6 text-gray-600" />
                </button>

                <div class="font-bold">
                    {{ monthName }} {{ year }}
                </div>

                <button
                    class="bg-white px-2 py-1 rounded-md cursor-pointer shadow"
                    @click="next"
                >
                    <CaretIcon class="h-6 w-6 rotate-180 text-gray-600" />
                </button>
            </div>

            <div class="grid grid-cols-7 rounded bg-amber-500 py-1">
                <div
                    v-for="day in daysLabel"
                    :key="day"
                    class="text-white py-1 text-center font-medium"
                >
                    {{ day }}
                </div>
            </div>

            <div class="grid grid-cols-7 gap-1 mt-1">
                <div
                    v-for="day in calendarDays"
                    :key="day.key"
                    class="min-h-14 p-0.5 rounded overflow-hidden"
                    :class="{
                        'text-gray-400': !day.currentMonth && day.histories.length == 0,
                        'ring-2 ring-amber-500': day.isToday,
                        'bg-amber-500 text-white': day.histories.length > 0,
                        'bg-white ': day.histories.length == 0,
                    }"
                >
                    <div
                        class="text-xs text-center font-medium p-0.5"
                        :class="{
                            'text-gray-400': !day.currentMonth && day.histories.length == 0,
                        }"
                    >
                        {{ day.day }}
                    </div>

                    <div class="mt-1 space-y-1">
                        <div
                            v-for="history in day.histories.slice(0, 3)"
                            :key="history.ts"
                            class="rounded px-0.5 py-0.5 font-semibold text-[8px] truncate text-white"
                            :title="new Date(history.ts).toLocaleString()"
                        >
                            {{ formatTime(history.ts) }}
                        </div>

                        <div
                            v-if="day.histories.length > 3"
                            class="text-[8px] text-gray-500 px-1"
                        >
                            +{{ day.histories.length - 3 }} more
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CaretIcon from '@/icons/CaretIcon.vue'
import type { TrackedData } from '@/types/history'
import { computed, ref } from 'vue'

const { histories } = defineProps<{
    histories: TrackedData[]
}>()

const daysLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const today = new Date()

const month = ref(today.getMonth()) // 0-11
const year = ref(today.getFullYear())

const monthName = computed(() =>
    new Date(year.value, month.value).toLocaleString('en-US', {
        month: 'long',
    }),
)

const next = () => {
    if (month.value === 11) {
        month.value = 0
        year.value++
    } else {
        month.value++
    }
}

const previous = () => {
    if (month.value === 0) {
        month.value = 11
        year.value--
    } else {
        month.value--
    }
}

interface CalendarDay {
    key: string
    day: number
    currentMonth: boolean
    isToday: boolean
    date: Date
    histories: TrackedData[]
}

const formatDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

const historiesByDate = computed(() => {
    const map = new Map<string, TrackedData[]>()

    for (const history of histories) {
        const key = formatDateKey(new Date(history.ts))

        if (!map.has(key))
            map.set(key, [])

        map.get(key)!.push(history)
    }

    // Sort each day's entries by time
    for (const entries of map.values()) {
        entries.sort(
            (a, b) =>
                new Date(a.ts).getTime() -
                new Date(b.ts).getTime(),
        )
    }

    return map
})

const calendarDays = computed<CalendarDay[]>(() => {
    const result: CalendarDay[] = []

    const firstDay = new Date(year.value, month.value, 1)
    const firstWeekday = firstDay.getDay()

    const daysInMonth = new Date(
        year.value,
        month.value + 1,
        0,
    ).getDate()

    const daysInPreviousMonth = new Date(
        year.value,
        month.value,
        0,
    ).getDate()

    // Previous month
    for (let i = firstWeekday - 1; i >= 0; i--) {
        const day = daysInPreviousMonth - i
        const date = new Date(year.value, month.value - 1, day)
        const dateKey = formatDateKey(date)

        result.push({
            key: `prev-${dateKey}`,
            day,
            currentMonth: false,
            isToday: false,
            date,
            histories: historiesByDate.value.get(dateKey) ?? [],
        })
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year.value, month.value, day)
        const dateKey = formatDateKey(date)

        result.push({
            key: `current-${dateKey}`,
            day,
            currentMonth: true,
            isToday:
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate(),
            date,
            histories: historiesByDate.value.get(dateKey) ?? [],
        })
    }

    // Next month
    const remaining = (7 - (result.length % 7)) % 7

    for (let day = 1; day <= remaining; day++) {
        const date = new Date(year.value, month.value + 1, day)
        const dateKey = formatDateKey(date)

        result.push({
            key: `next-${dateKey}`,
            day,
            currentMonth: false,
            isToday: false,
            date,
            histories: historiesByDate.value.get(dateKey) ?? [],
        })
    }

    return result
})
</script>