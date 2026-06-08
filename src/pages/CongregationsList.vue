<template>
    <div class="h-screen overflow-hidden w-full flex flex-col">
        <div class="flex justify-between pt-4 pl-4 pr-8 pb-2">
            <div class="font-bold text-2xl">Congregations</div>
            <button class="text-sm p-2 rounded shadow-md cursor-pointer" @click="gotoDash">
                <HomeIcon class="h-5 w-5" />
            </button>
        </div>
        <div class="flex-1 overflow-auto p-2">
            <div v-for="cong in history.congregations" :key="cong.cong + cong.lang" class="p-3">
                <div class="">
                    <div class="text-sm font-semibold">
                        {{ cong.cong }}
                    </div>
                    <div class="text-xs">
                        {{ cong.language }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import HomeIcon from '@/icons/HomeIcon.vue';
import { useHistoryStore } from '@/stores/history';
    import { usePageStore } from '@/stores/pages';

    const history = useHistoryStore()
    const pages = usePageStore()

    const gotoDash = () => pages.active = 'dashboard'
</script>