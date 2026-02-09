import Link from 'next/link';
import { Calendar, Tag, ArrowRight, ExternalLink } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  coverImage: string | null;
  source: string; // 'LOCAL' | 'MEDIUM'
  originalLink: string | null;
  createdAt: Date | string;
}

interface BlogCardProps {
  post: BlogPost;
  isDarkMode: boolean;
}

export default function BlogCard({ post, isDarkMode }: BlogCardProps) {
  const isMedium = post.source === 'MEDIUM';
  // Always link to internal detail page - even for Medium posts
  const href = `/blog/${post.slug}`;

  const date = new Date(post.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link
      href={href}
      className={`group block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
        isDarkMode
          ? 'bg-slate-700 hover:bg-slate-600 shadow-lg shadow-slate-900/50'
          : 'bg-white hover:bg-gray-50 shadow-lg shadow-gray-200/50'
      }`}
    >
      {/* Thumbnail */}
      {post.coverImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3
          className={`text-xl font-bold mb-3 line-clamp-2 transition-colors ${
            isDarkMode
              ? 'text-white group-hover:text-cyan-300'
              : 'text-gray-900 group-hover:text-blue-600'
          }`}
        >
          {post.title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm mb-4 line-clamp-3 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {post.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Date */}
          <div
            className={`flex items-center gap-1.5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <Calendar size={14} />
            <span>{date}</span>
          </div>

          {/* Source Badge */}
          <div
             className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
               isMedium 
                ? 'bg-black text-white' 
                : isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
             }`}
          >
             {isMedium ? 'Medium' : 'Local'}
             {isMedium && <ExternalLink size={10} />}
          </div>
        </div>

        {/* Read More Indicator */}
        <div
          className={`mt-4 flex items-center gap-1 text-sm font-medium transition-colors ${
            isDarkMode
              ? 'text-cyan-400 group-hover:text-cyan-300'
              : 'text-blue-600 group-hover:text-blue-500'
          }`}
        >
          <span>{isMedium ? 'Baca di Medium' : 'Baca selengkapnya'}</span>
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
