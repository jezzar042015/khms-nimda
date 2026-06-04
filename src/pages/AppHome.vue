<template>
    <div class="overflow-hidden h-screen flex flex-col">
        <div class="pt-4 px-4 pb-2 font-bold text-2xl">History</div>
        <div class="p-4 overflow-auto flex-1">
            <template v-for="gbd in history.groupedByDay" :key="gbd.day">
                <DailyGroup :gbd />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import DailyGroup from '@/components/history/DailyGroup.vue';
    import { useHistoryStore } from '@/stores/history';
    import { onMounted, watch } from 'vue';

    const history = useHistoryStore()

    onMounted(async () => {
        await history.pull()

    })

    watch(
        () => history.data,
        () => {
            const d = history.groupedByDay[0]
            if (d) history.expandingDay = d.day
        },
        {
            immediate: true
        }
    )
</script>
