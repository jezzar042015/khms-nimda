<template>
    <div class="h-screen overflow-hidden w-full flex flex-col">
        <div class="flex justify-between pt-4 pl-4 pr-8 pb-2">
            <div class="font-bold text-2xl">Congregations</div>
            <button class="-mt-2 text-sm p-2 rounded shadow-md cursor-pointer" @click="gotoDash">
                <HomeIcon class="h-5 w-5" />
            </button>
        </div>

        <div class="px-4">
            <input type="search" placeholder="Search" v-model="search"
                class="text-sm w-1/2 border border-gray-300 rounded-md px-3 py-2 outline-0">
        </div>

        <div class="flex-1 overflow-auto p-2">
            <div v-for="cong in filteredCongregations" :key="cong.cong + cong.lang" class="p-3">
                <div class="relative">
                    <div class="text-sm font-semibold flex justify-between">
                        <div class="w-3/5">
                            {{ cong.cong }}
                        </div>
                        <div class="absolute right-0 text-gray-500">
                            <button @click="reviewCongregationHistory(cong.cong)"
                                class="text-xs p-2 rounded shadow-md cursor-pointer">
                                See History
                            </button>
                        </div>
                    </div>
                    <div class="text-xs">
                        {{ cong.language }}
                    </div>
                    <div class="text-xs">
                        Tracked visits:  {{ cong.visits }}
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
    import { storeToRefs } from 'pinia';
    import { computed, ref } from 'vue';

    const history = useHistoryStore()
    const { congregations } = storeToRefs(history)
    const pages = usePageStore()
    const search = ref('')

    const filteredCongregations = computed(() => {
        if (!search.value) return congregations.value

        return congregations.value
            .filter(i => i.cong.toLowerCase()
                .includes(search.value.toLocaleLowerCase()))
    })

    const gotoDash = () => pages.active = 'dashboard'

    const reviewCongregationHistory = (cong: string) => {
        history.congregationSearch = cong
        pages.previous = 'congregations'
        pages.active = 'cong-history'
    }
</script>