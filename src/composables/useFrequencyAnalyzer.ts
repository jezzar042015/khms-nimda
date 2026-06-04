import type { TrackedData } from '@/types/history'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

const DAY_MS = 1000 * 60 * 60 * 24

export type FrequencyLabel =
  | 'Not enough data'
  | 'Almost daily'
  | '3 times a week'
  | 'Twice a week'
  | 'Once a week'
  | 'Once a month'
  | 'Every 2 months'
  | 'Quarterly'
  | 'Rare / irregular'

// Accepting MaybeRefOrGetter preserves Vue's reactivity chain properly
export function useFrequencyAnalyzer(itemsInput: MaybeRefOrGetter<TrackedData[]>) {
  
  const frequency = computed<FrequencyLabel>(() => {
    // Safely unwrap ref, getter, or plain array
    const items = toValue(itemsInput)

    if (!items || items.length < 2) {
      return 'Not enough data'
    }

    // Extract, clean, and sort timestamps ascending
    const timestamps = items
      .map(i => new Date(i.ts).getTime())
      .filter(ts => !Number.isNaN(ts))
      .sort((a, b) => a - b)

    if (timestamps.length < 2) {
      return 'Not enough data'
    }

    const first = timestamps[0]
    const last = timestamps.at(-1)!

    // If all events happened on the exact same millisecond
    if (!first) return 'Not enough data' 
    if (first === last) {
      return 'Not enough data'
    }

    // Calculate timespan. Clamp to a minimum of 1 day to prevent 
    // burst-actions (like 5 clicks in 10 minutes) from skewing the frequency.
    const spanDays = Math.max((last - first) / DAY_MS, 1)
    const count = timestamps.length

    // Base calculations on averages per week/month
    const perWeek = count / (spanDays / 7)
    const perMonth = count / (spanDays / 30)

    // ⚡ Weekly patterns
    if (perWeek >= 5)    return 'Almost daily'
    if (perWeek >= 2.5)  return '3 times a week'
    if (perWeek >= 1.5)  return 'Twice a week'
    if (perWeek >= 0.75) return 'Once a week'

    // 📅 Monthly patterns
    if (perMonth >= 1.2) return 'Once a month'
    if (perMonth >= 0.6) return 'Every 2 months'
    if (perMonth >= 0.3) return 'Quarterly'

    return 'Rare / irregular'
  })

  return {
    frequency
  }
}