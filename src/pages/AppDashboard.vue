<template>
    <div class="h-screen overflow-hidden w-full">
        <div class="p-4 space-y-8">
            <div class="text-xl font-bold">
                Dashboard
            </div>
            <div>
                <div class="text-gray-600">Congregations</div>
                <div class="text-3xl font-bold">{{ history.congregations.length }}</div>
            </div>

            <div>
                <div class="text-gray-600">Total Visits</div>
                <div class="text-3xl font-bold">{{ history.data.length }}</div>
            </div>

            <div>
                <div class="text-gray-600">Daily Average Visit</div>
                <div class="text-3xl font-bold">{{ averageDailyVisit }}</div>
            </div>

            <div @click="gotoCalenderView" class="flex items-center gap-2 p-3 rounded-md shadow-md w-fit cursor-pointer">
                <CalendarIcon class="h-5 w-5 " />
                <div class="font-semibold">Calendar History</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CalendarIcon from '@/icons/CalendarIcon.vue';
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';
    import { computed } from 'vue';

    const history = useHistoryStore()
    const pages = usePageStore()

    const gotoCalenderView = () => {
        pages.active = 'calendar'
    }

    const averageDailyVisit = computed(() => {
        return Math.round(history.data.length / history.groupedByDay.length)
    })
</script>