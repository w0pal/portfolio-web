'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import FullscreenMenu from './components/FullscreenMenu';
import Footer from './components/Footer';
import ThemeColorMeta from './components/ThemeColorMeta';
import { useTheme } from './hooks/useTheme';
import NowPlayingBubble from './components/NowPlayingBubble';

export default function Home() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { themeMode, isDarkMode, setTheme } = useTheme();

 const navigationCards = [
  {
   title: 'tentang',
   description: 'kamu bisa tahu siapa diri aku di sini',
   href: '/tentang',
  },
  {
   title: 'blog',
   description: 'aku suka nulis, klik ini ya!',
   href: '/blog',
  },
  {
   title: 'portfolio',
   description: 'karya, tapi dalam bentuk "professional"',
   href: '/portfolio',
  },
  {
   title: 'saat ini',
   description:
    'dalam page ini, aku nyimpen goal kecil aku, hal yang bikin aku seneng, dan lainnya.',
   href: '/saat-ini',
  },
 ];

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-800' : 'bg-white'
   } transition-colors duration-300`}
  >
   <ThemeColorMeta isDarkMode={isDarkMode} />
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
   {/* Main Content */}
   <main className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-12">
    <p
     className="text-2xl mb-1 animate-fade-in-up text-center font-semibold"
     style={{ color: isDarkMode ? '#F8F9FA' : '#1F2937' }}
    >
     selamat datang ke websitenya w0pal!
    </p>

    <p
     className="text-1xl mb-4 animate-fade-in-up animation-delay-400 text-center"
     style={{ color: isDarkMode ? '#F8F9FA' : '#1F2937' }}
    >
     *page ini keliatan redundant sih sama header, tapi gapapalah hehehe
    </p>

    {/* Navigation Cards */}
    <div className="space-y-2 mb-12">
     {navigationCards.map((card, index) => {
      return (
       <Link
        key={card.href}
        href={card.href}
        className={`group flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-300 hover:translate-x-2 animate-fade-in-up ${
         isDarkMode
          ? 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600'
          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
        }`}
        style={{ animationDelay: `${index * 100 + 200}ms` }}
       >
        {/* Left: Title */}
        <div className="flex items-center gap-3 flex-1">
         <div className="flex-1">
          <h3
           className={`text-base font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-900'
           }`}
          >
           {card.title}
          </h3>
          <p
           className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
           }`}
          >
           {card.description}
          </p>
         </div>
        </div>
       </Link>
      );
     })}
    </div>

    <Footer isDarkMode={isDarkMode} />
   </main>
  </div>
 );
}
