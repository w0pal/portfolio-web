'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
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
   description: 'kenali siapa aku',
   href: '/tentang',
  },
  {
   title: 'blog',
   description: 'tulisan-tulisanku',
   href: '/blog',
  },
  {
   title: 'portfolio',
   description: 'karya profesionalku',
   href: '/portfolio',
  },
  {
   title: 'saat ini',
   description: 'goals dan hal yang kusuka',
   href: '/saat-ini',
  },
 ];

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-900 glow-effect grid-background' : 'bg-white grid-background-light'
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

   {/* Hero Section */}
   <main className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 min-h-[80vh] flex flex-col justify-center items-center relative z-10">
    {/* Update Badge */}
    <div
     className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in-up ${
      isDarkMode
       ? 'bg-slate-800/80 border border-slate-700'
       : 'bg-gray-100 border border-gray-200'
     }`}
    >
     <Sparkles size={14} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} />
     <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      Personal Website
     </span>
    </div>

    {/* Main Title */}
    <h1
     className={`text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6 animate-fade-in-up animation-delay-200 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
     }`}
    >
     w0pal
    </h1>

    {/* Tagline */}
    <p
     className={`text-xl md:text-2xl text-center mb-10 max-w-2xl animate-fade-in-up animation-delay-400 ${
      isDarkMode ? 'text-gray-400' : 'text-gray-600'
     }`}
    >
     Mahasiswa Informatika • PC Enthusiast • Street Photographer
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up animation-delay-600">
     <Link
      href="/portfolio"
      className={`group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
       isDarkMode
        ? 'bg-white text-gray-900 hover:bg-gray-100'
        : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
     >
      <span>Lihat Portfolio</span>
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
     </Link>
     <Link
      href="/tentang"
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
       isDarkMode
        ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700'
        : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
      }`}
     >
      <span>Tentang Aku</span>
      <ArrowRight size={18} />
     </Link>
    </div>

    {/* Quick Navigation */}
    <div className="w-full max-w-xl">
     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {navigationCards.map((card, index) => (
       <Link
        key={card.href}
        href={card.href}
        className={`group p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 animate-fade-in-up ${
         isDarkMode
          ? 'bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50'
          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
        }`}
        style={{ animationDelay: `${index * 100 + 700}ms` }}
       >
        <h3
         className={`text-sm font-medium mb-1 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
         }`}
        >
         {card.title}
        </h3>
        <p
         className={`text-xs ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
         }`}
        >
         {card.description}
        </p>
       </Link>
      ))}
     </div>
    </div>
   </main>

   {/* Footer */}
   <div className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-8 relative z-10">
    <Footer isDarkMode={isDarkMode} />
   </div>
  </div>
 );
}
