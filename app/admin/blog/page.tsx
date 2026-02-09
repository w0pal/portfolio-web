import { prisma } from '../../lib/prisma';
import { fetchMediumPosts } from '../../lib/medium';
import Link from 'next/link';
import { Plus, Edit, ExternalLink, Eye } from 'lucide-react';
import DeleteButton from '../components/DeleteButton';

interface BlogPostDisplay {
  id: string;
  title: string;
  slug: string;
  source: string;
  originalLink: string | null;
  createdAt: Date;
  isFromMedium?: boolean;
}

export default async function AdminBlogPage() {
  // Fetch local posts from database
  const localPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Fetch Medium posts
  const mediumUsername = process.env.NEXT_PUBLIC_MEDIUM_USERNAME || '';
  const mediumPosts = await fetchMediumPosts(mediumUsername);

  // Convert Medium posts to display format
  const mediumPostsFormatted: BlogPostDisplay[] = mediumPosts.map((post) => ({
    id: `medium-${post.slug}`,
    title: post.title,
    slug: post.slug,
    source: 'MEDIUM',
    originalLink: post.link,
    createdAt: new Date(post.pubDate),
    isFromMedium: true,
  }));

  // Convert local posts to display format
  const localPostsFormatted: BlogPostDisplay[] = localPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    source: post.source,
    originalLink: post.originalLink,
    createdAt: post.createdAt,
    isFromMedium: false,
  }));

  // Combine and sort by date
  const allPosts = [...localPostsFormatted, ...mediumPostsFormatted].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Write Post
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
              <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Source</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {allPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="text-gray-900 dark:text-gray-100 font-medium">{post.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">/{post.slug}</div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      post.source === 'MEDIUM'
                        ? 'bg-black text-white'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}
                  >
                    {post.source}
                    {post.isFromMedium && ' (RSS)'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {post.originalLink && (
                      <a
                        href={post.originalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title="View Original"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Post"
                    >
                      <Eye size={18} />
                    </Link>
                    {!post.isFromMedium && (
                      <>
                        <Link
                          href={`/admin/blog/${post.slug}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <DeleteButton id={post.slug} endpoint="/api/blog" identifierType="slug" />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {allPosts.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No blog posts found. Write something new!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Posts from Medium RSS are read-only. To edit them, manage them directly on Medium.
      </p>
    </div>
  );
}
