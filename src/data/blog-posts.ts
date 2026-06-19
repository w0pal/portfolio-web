export interface BlogPost {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  coverImage: string | null
  source: string
  originalLink: string | null
  createdAt: string
  author?: string
  categories?: string[]
}

/*
 * Add your local blog posts here.
 * For Medium posts, add them with source: 'MEDIUM' and originalLink to the Medium URL.
 * Example:
 * {
 *   id: 'my-first-post',
 *   title: 'My First Post',
 *   slug: 'my-first-post',
 *   description: 'A brief description of the post.',
 *   content: 'Full markdown or HTML content...',
 *   coverImage: null,
 *   source: 'LOCAL',
 *   originalLink: null,
 *   createdAt: '2025-01-01T00:00:00.000Z',
 * }
 */

export const blogPosts: BlogPost[] = []
