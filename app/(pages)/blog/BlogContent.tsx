'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Header from '../../components/Header';
import FullscreenMenu from '../../components/FullscreenMenu';
import Footer from '../../components/Footer';
import { useTheme } from '../../hooks/useTheme';
import NowPlayingBubble from '../../components/NowPlayingBubble';
import BlogCard from '../../components/BlogCard';

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

interface BlogContentProps {
  posts: BlogPost[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { themeMode, isDarkMode, setTheme } = useTheme();

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        (post.description && post.description.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-slate-900 glow-effect grid-background' : 'bg-gray-50 grid-background-light'
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
        themeMode={themeMode}
        setTheme={setTheme}
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
        <div className="mb-10">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-3 animate-fade-in-up ${
              isDarkMode ? 'text-[#F8F9FA]' : 'text-[#1F2937]'
            }`}
          >
            Blog
          </h1>
          <p
            className={`text-base animate-fade-in-up animation-delay-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Tulisan-tulisan dari Medium dan catatan pribadi. Untuk yang lebih personal, cek{' '}

      <a
       href="https://www.threads.com/@w0pal"
       target="_blank"
       rel="noopener noreferrer"
       className={`underline transition-colors ${
        isDarkMode
         ? 'text-cyan-400 hover:text-cyan-300'
         : 'text-blue-600 hover:text-blue-500'
       }`}
      >
       Threads
      </a>
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <div className="relative max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
                isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up animation-delay-300">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-20 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <p className="text-lg">
              {searchQuery
                ? 'Tidak ada artikel yang cocok dengan pencarian.'
                : 'Belum ada artikel tersedia.'}
            </p>
          </div>
        )}
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
