<template>
    <div class="text-sm mb-4 p-3 shadow-md bg-white">
        <div class="font-bold">{{ dateDisplay }}</div>
        <div>{{ time }}</div>
        <div class="text-xs">{{ congHistoryItem.ts }}</div>
    </div>
</template>

<script setup lang="ts">
    import type { TrackedData } from '@/types/history';
    import { computed } from 'vue';

    const { congHistoryItem } = defineProps<{
        congHistoryItem: TrackedData
    }>()

    const time = computed(() => {
        const d = new Date(congHistoryItem.ts)

        return d.toLocaleTimeString('en-PH', {
            hour: 'numeric',
            minute: '2-digit',
        })
    })

    const dateDisplay = computed(() => {
        const d = new Date(congHistoryItem.ts)

        const datePart = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })

        const weekday = d.toLocaleDateString('en-US', {
            weekday: 'long',
        })

        return `${datePart}, ${weekday}`
    })
</script>