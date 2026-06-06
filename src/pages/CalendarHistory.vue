<template>
    <Teleport to="body">
        
    </Teleport>
    <div class="relative overflow-hidden h-screen flex flex-col">
        <ProgressLine v-show="history.fetching" />
        <div class="pt-4 px-4 pb-2">
            <div class="font-bold text-2xl">Usage Calendar</div>
            <div v-if="history.ts" class="text-xs">Updated: {{ timeAgo }}</div>
        </div>

        <div class="absolute right-0 top-5 flex justify-end pr-5">
            <button class="text-sm p-2 rounded shadow" @click="gotoList">
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
    import CalendarHistoryItem from '@/components/history/CalendarHistoryItem.vue';
    import ProgressLine from '@/components/ProgressLine.vue';
    import { useTimeAgo } from '@/composables/useTimeAgo';
    import ListIcon from '@/icons/ListIcon.vue';
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';
    import { storeToRefs } from 'pinia';

    const history = useHistoryStore()
    const pages = usePageStore()
    const { ts } = storeToRefs(history)
    const { timeAgo } = useTimeAgo(ts)

    const gotoList = () => pages.active = 'home'
</script>