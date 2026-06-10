<template>
    <div class="relative h-screen overflow-hidden w-full">
        <ProgressLine />
        <div class="px-6 py-8 space-y-8">
            <div class="text-3xl font-bold">
                <div> Dashboard</div>
                <div v-if="history.ts" class="text-xs font-normal">Updated: {{ timeAgo }}</div>
            </div>
            <div class="flex justify-between">
                <div @click="gotoCongregations" class="w-1/2">
                    <div class="text-gray-600 text-sm">
                        Congregations
                    </div>
                    <div class="text-3xl font-bold">{{ history.congregations.length }}</div>
                </div>

                <div class="w-1/2">
                    <div class="text-gray-600 text-sm">Total Visits</div>
                    <div class="text-3xl font-bold">{{ history.data.length }}</div>
                </div>
            </div>

            <div class="flex justify-between">
                <div class="w-1/2">
                    <div class="text-gray-600 text-sm">Daily Visits</div>
                    <div class="text-3xl font-bold">{{ averageDailyVisit }}</div>
                </div>
                <div class="w-1/2">
                    <div class="text-gray-600 text-sm">Visits Today</div>
                    <div class="text-3xl font-bold">{{ visitsToday.length }}</div>
                </div>
            </div>

            <div @click="gotoCalenderView"
                class="flex items-center gap-2 p-3 rounded-md shadow-md w-fit cursor-pointer">
                <CalendarIcon class="h-5 w-5 " />
                <div class="font-semibold">Calendar History</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CalendarIcon from '@/icons/CalendarIcon.vue';
    import ProgressLine from '@/components/ProgressLine.vue';
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';
    import { useTimeAgo } from '@/composables/useTimeAgo';

    const history = useHistoryStore()
    const pages = usePageStore()
    const { ts } = storeToRefs(history)
    const { timeAgo } = useTimeAgo(ts)

    const averageDailyVisit = computed(() => {
        return Math.round(history.data.length / history.groupedByDay.length)
    })

    const gotoCalenderView = () => {
        pages.active = 'calendar'
    }

    const gotoCongregations = () => {
        pages.active = 'congregations'
    }

    const visitsToday = computed(() => {
        const d = new Date()
        const [month, day, year] = d.toLocaleDateString('en-US', {
            month: '2-digit',
            year: 'numeric',
            day: '2-digit',

        }).split('/')
        const target = `${year}-${month}-${day}`

        const today = history.groupedByDay.find(m => m.day === target)
        return today ? today.tracked : []
    })
</script>