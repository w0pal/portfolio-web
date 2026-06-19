import { ref } from 'vue'
import { projects as staticProjects, type Project } from '@/data/projects'

export type { Project }

export function parseTags(tags: string[]): string[] {
  return tags
}

export function usePortfolio() {
  const items = ref<Project[]>(staticProjects)
  const loading = ref(false)

  return {
    items,
    loading,
  }
}
