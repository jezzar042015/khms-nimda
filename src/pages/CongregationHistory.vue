<template>
    <div class="overflow-hidden h-screen flex flex-col">
        <div @click="goHome" class="pt-4 px-4 pb-2 text-sm cursor-pointer flex items-center gap-1">
            <HomeIcon class="-mt-0.5 h-3 w-3" />
            <span>Home</span>
        </div>
        <div class="pt-0 px-4 pb-2">
            <div class="font-bold text-lg"> {{ history.congregationSearch }}</div>
            <div class="flex justify-between">
                <div class="text-sm">{{ analyzer.frequency.value }}</div>
                <div class="pt-2 flex justify-end gap-1">
                    <button class="text-sm p-2 rounded shadow" @click="mode = 'calendar'"
                        :class="{ 'bg-amber-500 text-white': isOnCalendarMode }">
                        <CalendarIcon class="h-5 w-5" />
                    </button>

                    <button class="text-sm p-2 rounded shadow" @click="mode = 'list'"
                        :class="{ 'bg-amber-500 text-white': isOnListMode }">
                        <ListIcon class="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
        <div class="py-4 px-2 overflow-auto flex-1">
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
    import { computed, onMounted, ref } from 'vue';
    import UsageCalendar from '@/components/history/UsageCalendar.vue';
    import ListIcon from '@/icons/ListIcon.vue';
    import CalendarIcon from '@/icons/CalendarIcon.vue';

    const history = useHistoryStore()
    const pages = usePageStore()
    const analyzer = useFrequencyAnalyzer(history.congregationHistory)
    const mode = ref<'list' | 'calendar'>('calendar')

    const goHome = () => {
        pages.active = 'home'
    }

    const isOnListMode = computed(() => mode.value === 'list')
    const isOnCalendarMode = computed(() => mode.value === 'calendar')

    onMounted(() => {
        if (!history.congregationSearch) {
            history.congregationSearch = 'TALANAY'
        }
    })
</script>
