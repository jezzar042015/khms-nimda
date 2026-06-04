<template>
    <div class="odd:bg-white font-normal even:bg-gray-200 text-sm text-black p-3">
        <div class="font-bold">{{ trackedItem.cong }}</div>
        <div class="text-xs">{{ language }}</div>
    </div>
</template>

<script setup lang="ts">
    import type { TrackedData } from '@/types/history';
    import { computed } from 'vue';

    const { trackedItem } = defineProps<{
        trackedItem: TrackedData
    }>()

    const language = computed(() => {
        const languages: Record<string, string> = {
            'ceb': 'Cebuano',
            'hil': 'Hiligaynon',
            'psp': 'Filipino Sign Langauge',
            'tl': 'Tagalog',
            'war': 'Waraywaray',
        }

        return languages[trackedItem.lang] ?? trackedItem.lang 
    })
</script>