<template>
    <div class="overflow-hidden h-screen flex flex-col">
        <div @click="goHome" class="pt-4 px-4 pb-2 text-sm cursor-pointer flex items-center gap-1">
            <HomeIcon class="h-3 w-3" />
            <span>Home</span>
        </div>
        <div class="pt-4 px-4 pb-2">
            <div class="font-bold text-2xl"> {{ history.congregationSearch }}</div>
            <div class="text-sm">{{ analyzer.frequency.value }}</div>
        </div>
        <div class="p-4 overflow-auto flex-1">
            <template v-for="ch in history.congregationHistory" :key="ch.ts">
                <CongHistoryItem :cong-history-item="ch" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CongHistoryItem from '@/components/history/CongHistoryItem.vue';
    import HomeIcon from '@/icons/HomeIcon.vue';
    import { computed } from 'vue';
    import { useFrequencyAnalyzer } from '@/composables/useFrequencyAnalyzer';
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';

    const history = useHistoryStore()
    const pages = usePageStore()
    const analyzer = useFrequencyAnalyzer(history.congregationHistory)

    const goHome = () => {
        pages.active = 'home'
    }

</script>
