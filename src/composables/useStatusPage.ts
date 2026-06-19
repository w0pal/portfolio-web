import { ref } from 'vue'
import { statusData as staticData, type StatusData } from '@/data/pages'

export type { StatusData }

export function useStatusPage() {
  const statusData = ref<StatusData>(staticData)

  return {
    statusData,
  }
}
