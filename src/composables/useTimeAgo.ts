// composables/useTimeAgo.ts
import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useTimeAgo(timestamp: number | string | Date) {
  const now = ref(Date.now())

  let interval: number

  onMounted(() => {
    interval = window.setInterval(() => {
      now.value = Date.now()
    }, 60_000) // update every minute
  })

  onUnmounted(() => {
    clearInterval(interval)
  })

  const timeAgo = computed(() => {
    const date = new Date(timestamp).getTime()
    const diff = now.value - date

    const minutes = Math.floor(diff / 60_000)
    const hours = Math.floor(diff / 3_600_000)
    const days = Math.floor(diff / 86_400_000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hr ago`
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`

    return new Date(date).toLocaleDateString()
  })

  return { timeAgo }
}