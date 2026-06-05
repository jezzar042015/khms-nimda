import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', () => {

    const token = useStorage<string>('nimda-auth-token', '', localStorage)

    const revoke = () => token.value = ''

    const register = async (user: string, pass: string) => {
        // 
    }

    const login = async (user: string, pass: string) => {
        const tempUsername = 'jezzar'
        const tempPassword = 'ldc08'
        const tempToken = 'jbl10202026'

        if (tempUsername === user && tempPassword === pass) {
            token.value = tempToken
            return true
        }

        return false
    }

    return {
        token,
        revoke,
        register,
        login
    }
})