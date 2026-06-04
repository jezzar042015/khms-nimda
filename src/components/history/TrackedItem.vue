<template>
    <div @click="setCongregationSearch" class="odd:bg-white font-normal even:bg-gray-200 text-sm text-black p-3">
        <div class="text-xs flex justify-between items-center">
            <div>{{ language }}</div>
            <div>{{ time }}</div>
        </div>
        <div class="font-bold">{{ trackedItem.cong }}</div>
    </div>
</template>

<script setup lang="ts">
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';
    import type { TrackedData } from '@/types/history';
    import { computed } from 'vue';

    const { trackedItem } = defineProps<{
        trackedItem: TrackedData
    }>()

    const history = useHistoryStore()
    const pages = usePageStore()

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

    const time = computed(() => {
        const d = new Date(trackedItem.ts)

        return d.toLocaleTimeString('en-PH', {
            hour: 'numeric',
            minute: '2-digit',
        })
    })

    const setCongregationSearch = () => {
        history.congregationSearch = trackedItem.cong
        pages.active = 'cong-history'
    }
</script>