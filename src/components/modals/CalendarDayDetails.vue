<template>
    <div v-if="pages.modal == 'calendar-day-details' && hasTrackedItems" @click.self="close"
        class="flex absolute left-0 top-0 h-screen w-full overflow-hidden bg-black/80 z-10">

        <div class="flex flex-col bg-white w-[85%] h-[80%] my-10 m-auto max-w-md rounded-md py-4 pl-4">
            <div class=" py-3 font-bold text-xl">{{ dateDisplay }}</div>

            <div class="flex-1 overflow-auto space-y-5">

                <div v-for="trackedItems in modifiedTrackedItems" :key="trackedItems.ts" class="px-1 flex">
                    <div class="w-18 text-xs py-0.5"> {{ trackedItems.time }}</div>
                    <div class="flex-1 text-sm">
                        <div class="font-bold">{{ trackedItems.cong }}</div>
                        <div class="text-xs">{{ trackedItems.language }}</div>
                        <button @click="reviewCongregationHistory(trackedItems.cong)"
                            class="shadow mt-2 py-1 px-2 rounded-sm text-[11px] cursor-pointer">
                            Review History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';
    import { computed } from 'vue';

    const pages = usePageStore();
    const history = useHistoryStore()

    const hasTrackedItems = computed(() => {
        const tracked = history.trackedItemsByDay?.tracked
        if (!tracked) return false
        return tracked.length > 0
    })

    const modifiedTrackedItems = computed(() => {
        if (!history.trackedItemsByDay) return []
        return [...history.trackedItemsByDay.tracked].reverse()
    })

    const languages: Record<string, string> = {
        'ceb': 'Cebuano',
        'hil': 'Hiligaynon',
        'psp': 'Filipino Sign Langauge',
        'tl': 'Tagalog',
        'war': 'Waraywaray',
    }

    const dateDisplay = computed(() => {
        if (!history.trackedItemsByDay) return ''
        const d = new Date(history.trackedItemsByDay.day)
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            weekday: 'long',
        })
    })

    const close = () => {
        pages.modal = ''
    }

    const reviewCongregationHistory = (cong: string) => {
        history.congregationSearch = cong
        pages.previous = 'calendar'
        pages.active = 'cong-history'
    }
</script>