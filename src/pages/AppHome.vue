<template>
    <div class="relative overflow-hidden h-screen flex flex-col">
        <ProgressLine v-show="history.fetching" />
        <div class="pt-4 px-4 pb-2">
            <div class="font-bold text-2xl">History</div>
            <div v-if="history.ts" class="text-xs">Updated: {{ timeAgo }}</div>
        </div>

        <div class="absolute right-0 top-5 flex justify-end pr-5">
            <button class="text-sm p-2 rounded shadow" @click="gotoCalender">
                <CalendarIcon class="h-5 w-5" />
            </button>
        </div>

        <div class="p-4 overflow-auto flex-1">
            <template v-for="gbd in history.groupedByDay" :key="gbd.day">
                <DailyGroup :gbd />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CalendarIcon from '@/icons/CalendarIcon.vue';
    import DailyGroup from '@/components/history/DailyGroup.vue';
    import ProgressLine from '@/components/ProgressLine.vue';
    import { onMounted } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useHistoryStore } from '@/stores/history';
    import { useTimeAgo } from '@/composables/useTimeAgo';
    import { usePageStore } from '@/stores/pages';

    const history = useHistoryStore()
    const pages = usePageStore()
    const { ts } = storeToRefs(history)
    const { timeAgo } = useTimeAgo(ts)

    const gotoCalender = () => pages.active ='calendar'

    onMounted(() => {
        if (!history.targetDay) {
            const d = history.groupedByDay[0]
            if (d) history.targetDay = d.day
        }
    })

</script>