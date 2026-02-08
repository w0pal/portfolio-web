'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, User, ExternalLink } from 'lucide-react';
import Header from '../../../components/Header';
import FullscreenMenu from '../../../components/FullscreenMenu';
import Footer from '../../../components/Footer';
import { useTheme } from '../../../hooks/useTheme';
import NowPlayingBubble from '../../../components/NowPlayingBubble';
import { MediumPost, formatDate } from '../../../lib/medium';

interface BlogDetailContentProps {
 post: MediumPost;
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { themeMode, isDarkMode, setTheme } = useTheme();

 // Clean HTML content for display - show image captions only, images viewable on Medium
 const fullCleanContent = post.fullContent
  .replace(/<figure[^>]*>/gi, '<figure class="my-6 p-4 rounded-lg bg-gray-100 dark:bg-slate-700">')
  .replace(/<img[^>]*>/gi, '<div class="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">[Gambar - lihat di Medium]</div>')
  .replace(/<figcaption[^>]*>/gi, '<figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 italic">')
  .replace(/<h3[^>]*>/gi, '<h3 class="text-xl font-semibold mt-6 mb-3">')
  .replace(/<h4[^>]*>/gi, '<h4 class="text-lg font-semibold mt-4 mb-2">')
  .replace(/<p[^>]*>/gi, '<p class="mb-4 leading-relaxed">')
  .replace(/<a /gi, '<a class="underline hover:opacity-80" ')
  .replace(/<blockquote[^>]*>/gi, '<blockquote class="border-l-4 pl-4 italic my-4 opacity-80">')
  .replace(/<ul[^>]*>/gi, '<ul class="list-disc list-inside mb-4 space-y-1">')
  .replace(/<ol[^>]*>/gi, '<ol class="list-decimal list-inside mb-4 space-y-1">');

 // Truncate HTML content while preserving tags
 const truncateHTML = (html: string, maxChars: number): string => {
  let charCount = 0;
  let result = '';
  let i = 0;
  const tagStack: string[] = [];

  while (i < html.length && charCount < maxChars) {
   if (html[i] === '<') {
    const tagEnd = html.indexOf('>', i);
    if (tagEnd !== -1) {
     const tag = html.slice(i, tagEnd + 1);
     result += tag;

     // Track opening/closing tags
     const tagMatch = tag.match(/^<\/?([a-z0-9]+)/i);
     if (tagMatch && !tag.endsWith('/>') && !['br', 'hr', 'img', 'input'].includes(tagMatch[1].toLowerCase())) {
      if (tag[1] !== '/') {
       tagStack.push(tagMatch[1]);
      } else {
       tagStack.pop();
      }
     }
     i = tagEnd + 1;
     continue;
    }
   }
   result += html[i];
   charCount++;
   i++;
  }

  // Close any open tags
  while (tagStack.length > 0) {
   result += `</${tagStack.pop()}>`;
  }

  // Check if content was truncated
  const fullTextLength = html.replace(/<[^>]*>/g, '').length;
  if (fullTextLength > maxChars) {
   result += '...';
  }

  return result;
 };

 const cleanContent = truncateHTML(fullCleanContent, 850);

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-900 glow-effect grid-background' : 'bg-white grid-background-light'
   } transition-colors duration-300`}
  >
   <Header
    isDarkMode={isDarkMode}
    themeMode={themeMode}
    setTheme={setTheme}
    isMenuOpen={isMenuOpen}
    setIsMenuOpen={setIsMenuOpen}
   />

   <FullscreenMenu
    isDarkMode={isDarkMode}
    isMenuOpen={isMenuOpen}
    setIsMenuOpen={setIsMenuOpen}
   />
   <NowPlayingBubble
    username={process.env.NEXT_PUBLIC_LASTFM_USERNAME || ''}
    apiKey={process.env.NEXT_PUBLIC_LASTFM_API_KEY || ''}
    isDarkMode={isDarkMode}
   />

   <main className="container mx-auto max-w-[90%] lg:max-w-[70%] xl:max-w-[60%] px-6 py-8">
    {/* Back Button */}
    <Link
     href="/blog"
     className={`inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors animate-fade-in ${
      isDarkMode
       ? 'text-gray-400 hover:text-cyan-400'
       : 'text-gray-600 hover:text-blue-600'
     }`}
    >
     <ArrowLeft size={18} />
     <span>Kembali ke Blog</span>
    </Link>

    {/* Article Header */}
    <article className="animate-fade-in-up">
     {/* Thumbnail */}
     {post.thumbnail && (
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
       <img
        src={post.thumbnail}
        alt={post.title}
        className="w-full h-full object-cover"
       />
      </div>
     )}

     {/* Title */}
     <h1
      className={`text-3xl md:text-4xl font-bold mb-6 leading-tight ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      {post.title}
     </h1>

     {/* Meta Info */}
     <div
      className={`flex flex-wrap items-center gap-4 md:gap-6 mb-8 pb-8 border-b ${
       isDarkMode ? 'border-slate-700 text-gray-400' : 'border-gray-200 text-gray-500'
      }`}
     >
      {/* Author */}
      <div className="flex items-center gap-2">
       <User size={16} />
       <span>{post.author}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2">
       <Calendar size={16} />
       <span>{formatDate(post.pubDate)}</span>
      </div>

      {/* Categories */}
      {post.categories.length > 0 && (
       <div className="flex items-center gap-2">
        <Tag size={16} />
        <div className="flex flex-wrap gap-2">
         {post.categories.map((cat, index) => (
          <span
           key={index}
           className={`px-2 py-0.5 text-xs rounded-full ${
            isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
           }`}
          >
           {cat}
          </span>
         ))}
        </div>
       </div>
      )}
     </div>

     {/* Content Preview with HTML formatting */}
     <div className="relative mb-8">
      <div
       className={`prose max-w-none ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
       }`}
       dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
      {/* Fade overlay */}
      <div
       className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t pointer-events-none ${
        isDarkMode
         ? 'from-slate-900 to-transparent'
         : 'from-white to-transparent'
       }`}
      />
     </div>

     {/* Read on Medium CTA */}
     <div
      className={`p-6 rounded-xl text-center ${
       isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
      }`}
     >
      <p
       className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
      >
       Baca artikel lengkap di Medium
      </p>
      <a
       href={post.link}
       target="_blank"
       rel="noopener noreferrer"
       className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isDarkMode
         ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
         : 'bg-blue-600 hover:bg-blue-500 text-white'
       }`}
      >
       <span>Baca Selengkapnya di Medium</span>
       <ExternalLink size={18} />
      </a>
     </div>
    </article>
   </main>

   <Footer isDarkMode={isDarkMode} />
  </div>
 );
}
