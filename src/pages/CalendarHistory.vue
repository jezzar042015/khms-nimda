<template>
    <Teleport to="body">
        <CalendarDayDetails />
    </Teleport>
    <div class="relative overflow-hidden h-screen flex flex-col">
        <ProgressLine v-show="history.fetching" />
        <div class="pt-4 px-4 pb-2">
            <div class="font-bold text-2xl">Usage Calendar</div>
            <div v-if="history.ts" class="text-xs">Updated: {{ timeAgo }}</div>
        </div>

        <div class="absolute right-0 top-5 flex justify-end pr-5">

            <button class="text-sm p-2 rounded shadow-md cursor-pointer" @click="gotoDash">
                <HomeIcon class="h-5 w-5" />
            </button>

            <button class="text-sm p-2 rounded shadow-md cursor-pointer" @click="gotoList">
                <ListIcon class="h-5 w-5" />
            </button>
        </div>

        <div class="flex-1 overflow-auto pb-10">
            <div v-for="gbm in history.groupedByMonth" :key="gbm.month">
                <CalendarHistoryItem :month="gbm.month" :tracked="gbm.tracked"></CalendarHistoryItem>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CalendarDayDetails from '@/components/modals/CalendarDayDetails.vue';
    import CalendarHistoryItem from '@/components/history/CalendarHistoryItem.vue';
    import HomeIcon from '@/icons/HomeIcon.vue';
    import ListIcon from '@/icons/ListIcon.vue';
    import ProgressLine from '@/components/ProgressLine.vue';
    import { storeToRefs } from 'pinia';
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';
    import { useTimeAgo } from '@/composables/useTimeAgo';
    
    const history = useHistoryStore()
    const pages = usePageStore()
    const { ts } = storeToRefs(history)
    const { timeAgo } = useTimeAgo(ts)

    const gotoDash = () => pages.active = 'dashboard'
    const gotoList = () => pages.active = 'home'
</script>