import { ref } from 'vue'
import { aboutData as staticData, type AboutData } from '@/data/pages'

export type { AboutData }

export function useAboutPage() {
  const aboutData = ref<AboutData>(staticData)

  return {
    aboutData,
  }
}
