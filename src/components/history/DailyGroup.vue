<template>
    <div class="pt-2 mt-2 cursor-pointer" :class="expand
        ? 'bg-amber-500 text-white font-bold shadow-lg rounded-sm mb-10'
        : 'bg-gray-100'">
        <div @click="setExpand" class="p-3 flex justify-between items-center">
            <div>{{ dateDisplay }}</div>
            <div>{{ gbd.tracked.length }}</div>
        </div>

        <Transition name="expand">
            <div v-if="expand" class="py-0 mb-3 overflow-hidden">
                <template v-for="trackedItem in gbd.tracked" :key="trackedItem.ts">
                    <TrackedItem :tracked-item="trackedItem" />
                </template>
            </div>
        </Transition>
    </div>

</template>

<script setup lang="ts">
    import type { GroupedDaily } from '@/types/history';
    import { computed, ref, watch } from 'vue';
    import TrackedItem from './TrackedItem.vue';
    import { useHistoryStore } from '@/stores/history.ts';

    const { gbd } = defineProps<{
        gbd: GroupedDaily
    }>()

    const expand = ref(false)
    const history = useHistoryStore()

    const setExpand = () => {
        expand.value = !expand.value
        history.expandingDay = expand.value ? gbd.day : ''
    }

    const dateDisplay = computed(() => {
        const d = new Date(gbd.day)

        const datePart = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })

        const weekday = d.toLocaleDateString('en-US', {
            weekday: 'long',
        })

        return `${datePart}, ${weekday}`
    })

    watch(
        () => history.expandingDay,
        (v) => {
            expand.value = v === gbd.day
        },
        {
            immediate: true
        }
    )

</script>

<style scoped>

    .expand-enter-active,
    .expand-leave-active
    {
        transition:
            max-height 0.3s ease,
            opacity 0.3s ease;
        overflow: hidden;
    }

    .expand-enter-from,
    .expand-leave-to
    {
        max-height: 0;
        opacity: 0;
    }

    .expand-enter-to,
    .expand-leave-from
    {
        max-height: 500px;
        /* adjust as needed */
        opacity: 1;
    }
</style>