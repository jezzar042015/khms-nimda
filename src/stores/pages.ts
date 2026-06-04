import type { AppPages } from "@/types/pages";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePageStore = defineStore('pages', () => {
    
    const active = ref<AppPages>('home')

    return {
        active
    }
})