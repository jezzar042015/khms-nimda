import type { GroupedDaily, GroupedMonthly, TrackedData } from "@/types/history";
import type { TrackedDataResponse } from "@/types/responses";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useHistoryStore = defineStore('history', () => {
    const data = useStorage<TrackedData[]>('nimda-history-data', [], localStorage, { mergeDefaults: true })
    const ts = useStorage<string>('nimda-data-ts', '', localStorage)
    const fetching = ref(false)
    const targetDay = ref('')
    const congregationSearch = ref('')

    const SERVER_URL = "https://script.google.com/macros/s/AKfycbykPMZqy-ztAL15ZZTctlnWdu6Zwb0NwObH161tof0H5XBU2W5PAfqNlEvVATuGGBmxJQ/exec"

    const reversed = computed(() => {
        return [...data.value].reverse()
    })

    const languages: Record<string, string> = {
        'ceb': 'Cebuano',
        'hil': 'Hiligaynon',
        'psp': 'Filipino Sign Langauge',
        'tl': 'Tagalog',
        'war': 'Waraywaray',
    }

    const expandLanguage = (code: string): string => {
        return languages[code] ?? code
    }

    const getTime = (ts: string) => {
        const d = new Date(ts)
        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
            minute: 'numeric'
        })
    }

    const groupedByDay = computed<GroupedDaily[]>(() => {
        const groups: Record<string, TrackedData[]> = {};

        for (const item of reversed.value) {
            const date = new Date(item.ts);

            // Local date in YYYY-MM-DD format
            const dayKey = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, '0'),
                String(date.getDate()).padStart(2, '0'),
            ].join('-');

            const dayGroup = groups[dayKey] ?? (groups[dayKey] = [])
            item.language = expandLanguage(item.lang)
            item.time = getTime(item.ts)
            dayGroup.push(item)
        }

        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([day, tracked]) => ({
                day,
                tracked,
            }));
    });

    const trackedItemsByDay = computed(() => {
        const d = groupedByDay.value.find(g => g.day == targetDay.value)
        return d
    })

    const groupedByMonth = computed<GroupedMonthly[]>(() => {
        const groups: Record<string, GroupedDaily[]> = {}

        for (const dayGroup of groupedByDay.value) {
            const monthKey = dayGroup.day.slice(0, 7)

            const monthGroup = groups[monthKey] ?? (groups[monthKey] = [])
            monthGroup.push(dayGroup)
        }

        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([month, tracked]) => ({
                month,
                tracked,
            }))
    })

    const congregationHistory = computed(() => {
        return reversed.value.filter(h => h.cong === congregationSearch.value)
    })

    const pull = async () => {
        try {
            fetching.value = true
            const response = await fetch(SERVER_URL)
            const result = await response.json() as TrackedDataResponse

            if (result.status === 200) {
                data.value = result.data
                fetching.value = false
                ts.value = result.timestamp
            }
        } catch (error) {
            console.log(error);
            fetching.value = false
        }
    }

    const congregations = computed<TrackedData[]>(() => {
        const map = new Map<string, TrackedData>()

        for (const item of data.value) {
            const key = `${item.cong}|${item.lang}|${item.classes}`

            if (!map.has(key)) {
                map.set(key, item)
            }
        }

        return [...map.values()].sort((a, b) => a.cong.localeCompare(b.cong))
    })

    return {
        data,
        reversed,
        groupedByDay,
        groupedByMonth,
        targetDay,
        trackedItemsByDay,
        congregationSearch,
        congregationHistory,
        fetching,
        congregations,
        pull,
        ts
    }
})