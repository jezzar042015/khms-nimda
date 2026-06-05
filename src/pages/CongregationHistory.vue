<template>
    <div class="overflow-hidden h-screen flex flex-col">
        <div @click="goHome" class="pt-4 px-4 pb-2 text-sm cursor-pointer flex items-center gap-1">
            <HomeIcon class="-mt-0.5 h-3 w-3" />
            <span>Home</span>
        </div>
        <div class="pt-4 px-4 pb-2">
            <div class="font-bold text-2xl"> {{ history.congregationSearch }}</div>
            <div class="text-sm">{{ analyzer.frequency.value }}</div>
        </div>
        <div class="flex justify-end pr-5 gap-1">
            <button class="text-sm p-2 rounded shadow" @click="mode = 'list'">
                <ListIcon class="h-5 w-5" />
            </button>
            <button class="text-sm p-2 rounded shadow" @click="mode = 'calendar'">
                <CalendarIcon class="h-5 w-5" />
            </button>
        </div>
        <div class="py-4 overflow-auto flex-1">
            <template v-if="mode == 'list'" v-for="ch in history.congregationHistory" :key="ch.ts">
                <CongHistoryItem :cong-history-item="ch" />
            </template>

            <template v-if="mode == 'calendar'">
                <UsageCalendar :histories="history.congregationHistory" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CongHistoryItem from '@/components/history/CongHistoryItem.vue';
    import HomeIcon from '@/icons/HomeIcon.vue';
    import { useFrequencyAnalyzer } from '@/composables/useFrequencyAnalyzer';
    import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';
    import { onMounted, ref } from 'vue';
    import UsageCalendar from '@/components/history/UsageCalendar.vue';
    import ListIcon from '@/icons/ListIcon.vue';
    import CalendarIcon from '@/icons/CalendarIcon.vue';

    const history = useHistoryStore()
    const pages = usePageStore()
    const analyzer = useFrequencyAnalyzer(history.congregationHistory)
    const mode = ref<'list' | 'calendar'>('list')

    const goHome = () => {
        pages.active = 'home'
    }

    onMounted(() => {
        if (!history.congregationSearch) {
            history.congregationSearch = 'TALANAY'
        }
    })
</script>
