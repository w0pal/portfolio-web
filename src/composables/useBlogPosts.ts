import { ref, computed } from 'vue'
import { blogPosts as staticPosts, type BlogPost } from '@/data/blog-posts'
import { useMediumPosts } from './useMediumPosts'

export type { BlogPost }

export function useBlogPosts() {
  const { posts: mediumPosts, loading } = useMediumPosts()
  const searchQuery = ref('')

  const posts = computed(() => [...staticPosts, ...mediumPosts.value])

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
