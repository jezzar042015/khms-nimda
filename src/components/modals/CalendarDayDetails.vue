<template>
    <div v-if="pages.modal == 'calendar-day-details'" @click.self="close"
        class="flex absolute left-0 top-0 h-screen w-full overflow-hidden bg-black/80 z-10">

        <div class="bg-white w-[90%] h-[90%] my-10 m-auto max-w-md rounded-md p-4">
            <div class="h-full overflow-auto">
                <div v-for="trackedItems in history.trackedItemsByDay?.tracked" :key="trackedItems.ts" class="p-2">
                    <div> {{ trackedItems.ts }}</div>
                    <div> {{ trackedItems.cong }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';

    const pages = usePageStore();
    const history = useHistoryStore()

    const close = () => {
        pages.modal = ''
    }
</script>