import { ExternalLink, Calendar, Tag } from 'lucide-react';
import { MediumPost } from '../lib/medium';
import { formatDate } from '../lib/medium';

interface BlogCardProps {
 post: MediumPost;
 isDarkMode: boolean;
}

export default function BlogCard({ post, isDarkMode }: BlogCardProps) {
 return (
  <a
   href={post.link}
   target="_blank"
   rel="noopener noreferrer"
   className={`group block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
    isDarkMode
     ? 'bg-slate-700 hover:bg-slate-600 shadow-lg shadow-slate-900/50'
     : 'bg-white hover:bg-gray-50 shadow-lg shadow-gray-200/50'
   }`}
  >
   {/* Thumbnail */}
   {post.thumbnail && (
    <div className="relative w-full h-48 overflow-hidden">
     <img
      src={post.thumbnail}
      alt={post.title}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
     />
     <div className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm">
      <ExternalLink size={16} className="text-white" />
     </div>
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
      <span>{formatDate(post.pubDate)}</span>
     </div>

     {/* Categories */}
     {post.categories.length > 0 && (
      <div
       className={`flex items-center gap-1.5 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
       }`}
      >
       <Tag size={14} />
       <span className="truncate">{post.categories[0]}</span>
       {post.categories.length > 1 && (
        <span className="text-xs">+{post.categories.length - 1}</span>
       )}
      </div>
     )}
    </div>
   </div>
  </a>
 );
}
