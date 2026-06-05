<template>
    <div class="overflow-hidden h-screen flex flex-col">
        <div class="pt-4 px-4 pb-2">
            <div class="font-bold text-2xl">History</div>
            <div v-if="history.ts" class="text-xs">Updated: {{ timeAgo }}</div>
        </div>

        <div class="p-4 overflow-auto flex-1">
            <template v-for="gbd in history.groupedByDay" :key="gbd.day">
                <DailyGroup :gbd />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import DailyGroup from '@/components/history/DailyGroup.vue';
    import { useTimeAgo } from '@/composables/useTimeAgo';
    import { useHistoryStore } from '@/stores/history';
    import { storeToRefs } from 'pinia';
    import { onMounted } from 'vue';

    const history = useHistoryStore()
    const { ts } = storeToRefs(history)
    const { timeAgo } = useTimeAgo(ts)

    onMounted(async () => {
        if (!history.expandingDay) {
            const d = history.groupedByDay[0]
            if (d) history.expandingDay = d.day
        }
    })

</script>
