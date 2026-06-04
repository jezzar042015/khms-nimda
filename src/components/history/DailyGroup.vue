<template>
    <div class="pt-2 mt-2" :class="expand ? 'bg-amber-500 text-white font-bold' : 'bg-gray-100'">
        <div @click="expand = !expand" class="p-3 flex justify-between items-center">
            <div>{{ dateDisplay }}</div>
            <div>{{ gbd.tracked.length }}</div>
        </div>
        <div v-if="expand" class="py-0 mb-3">
            <template v-for="trackedItem in gbd.tracked" :key="trackedItem.ts">
                <TrackedItem :tracked-item />
            </template>
        </div>
    </div>

</template>

<script setup lang="ts">
    import type { GroupedDaily } from '@/types/history';
    import { computed, ref } from 'vue';
    import TrackedItem from './TrackedItem.vue';

    const { gbd } = defineProps<{
        gbd: GroupedDaily
    }>()

    const expand = ref(false)

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
</script>