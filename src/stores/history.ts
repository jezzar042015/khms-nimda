import type { GroupedDaily, TrackedData } from "@/types/history";
import type { TrackedDataResponse } from "@/types/responses";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useHistoryStore = defineStore('history', () => {
    const data = useStorage<TrackedData[]>('nimda-history-data', [], localStorage, { mergeDefaults: true })
    const fetching = ref(false)
    const expandingDay = ref('')
    const congregationSearch = ref('')

    const SERVER_URL = "https://script.google.com/macros/s/AKfycbykPMZqy-ztAL15ZZTctlnWdu6Zwb0NwObH161tof0H5XBU2W5PAfqNlEvVATuGGBmxJQ/exec"

    const reversed = computed(() => {
        return [...data.value].reverse()
    })

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

            (groups[dayKey] ??= []).push(item);
        }

        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([day, tracked]) => ({
                day,
                tracked,
            }));
    });

    const congregationHistory = computed(()=> {
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
            }
        } catch (error) {
            console.log(error);
            fetching.value = false
        }
    }

    return {
        data,
        reversed,
        groupedByDay,
        expandingDay,
        congregationSearch,
        congregationHistory,
        fetching,
        pull,
    }
})