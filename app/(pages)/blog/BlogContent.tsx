'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import FullscreenMenu from '../../components/FullscreenMenu';
import Footer from '../../components/Footer';
import { useTheme } from '../../hooks/useTheme';
import NowPlayingBubble from '../../components/NowPlayingBubble';
import BlogCard from '../../components/BlogCard';
import { MediumPost } from '../../lib/medium';

interface BlogContentProps {
 posts: MediumPost[];
}

export default function BlogContent({ posts }: BlogContentProps) {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { themeMode, isDarkMode, setTheme } = useTheme();

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-800' : 'bg-white'
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
   <main className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-8">
    {/* Header Section */}
    <div className="mb-12">
     <h1
      className={`text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up ${
       isDarkMode ? 'text-[#F8F9FA]' : 'text-[#1F2937]'
      }`}
     >
      blog gweh
     </h1>
     <p
      className={`text-lg animate-fade-in-up animation-delay-200 ${
       isDarkMode ? 'text-[#F8F9FA]' : 'text-[#1F2937]'
      }`}
     >
      halamannya nyambung ke page medium aku. kalau mau lihat yang lebih
      personal, bisa ke akun{' '}
      <a
       href="https://www.threads.com/@w0pal"
       target="_blank"
       rel="noopener noreferrer"
       className="underline hover:text-blue-500"
      >
       threads
      </a>{' '}
      aku, ya!
     </p>
    </div>

    {/* Posts Grid */}
    {posts.length > 0 ? (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up animation-delay-300">
      {posts.map((post, index) => (
       <BlogCard key={index} post={post} isDarkMode={isDarkMode} />
      ))}
     </div>
    ) : (
     <div
      className={`text-center py-20 ${
       isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}
     >
      <p className="text-lg">Belum ada artikel tersedia.</p>
     </div>
    )}
   </main>
   <Footer isDarkMode={isDarkMode} />
  </div>
 );
}
