import { fetchMediumPosts } from '../../lib/medium';
import BlogContent from './BlogContent';

export default async function BlogPage() {
 const mediumUsername = process.env.NEXT_PUBLIC_MEDIUM_USERNAME || '';
 const posts = await fetchMediumPosts(mediumUsername);

 return <BlogContent posts={posts} />;
}
