import { ref, computed } from 'vue'
import { blogPosts as staticPosts, type BlogPost } from '@/data/blog-posts'
import { mediumPosts } from '@/data/medium-posts'

export type { BlogPost }

export function useBlogPosts() {
  const posts = ref<BlogPost[]>([...staticPosts, ...mediumPosts])
  const searchQuery = ref('')
  const loading = ref(false)

  const filteredPosts = computed(() => {
    if (!searchQuery.value.trim()) return posts.value
    const q = searchQuery.value.toLowerCase()
    return posts.value.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  })

  return {
    posts,
    searchQuery,
    loading,
    filteredPosts,
  }
}
