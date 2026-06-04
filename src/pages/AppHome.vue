<template>
    <div>
        <div class="p-4">
            <template v-for="gbd in history.groupedByDay" :key="gbd.day">
                <DailyGroup :gbd />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import DailyGroup from '@/components/history/DailyGroup.vue';
    import { useHistoryStore } from '@/stores/history';
    import { onMounted } from 'vue';

    const history = useHistoryStore()

    onMounted(async () => {
        await history.pull()
    })
</script>
