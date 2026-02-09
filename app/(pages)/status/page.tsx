'use client';

import { useState } from 'react';
import { Target, Heart, Sparkles } from 'lucide-react';
import Header from '../../components/Header';
import FullscreenMenu from '../../components/FullscreenMenu';
import Footer from '../../components/Footer';
import ThemeColorMeta from '../../components/ThemeColorMeta';
import { useTheme } from '../../hooks/useTheme';
import NowPlayingBubble from '../../components/NowPlayingBubble';

export default function SaatIniPage() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { themeMode, isDarkMode, setTheme } = useTheme();

 const goals = [
  'Lulus kuliah menggunakan Linux (jurnal, skripsi, etc)',
  'Konsisten daily photo di Instagram',
 ];

 const interests = [
  'Street photography',
  'PC building & optimization',
  'Linux customization',
  'Web development',
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

   <main className="container mx-auto max-w-[90%] lg:max-w-[70%] xl:max-w-[60%] px-6 py-12 relative z-10">
    {/* Header */}
    <section className="mb-12">
     <h1
      className={`text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      Status
     </h1>
     <p
      className={`text-lg animate-fade-in-up animation-delay-200 ${
       isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}
     >
      Apa yang sedang aku kerjakan dan fokuskan saat ini.
     </p>
    </section>

    {/* Goals Section */}
    <section className="mb-12">
     <div className="flex items-center gap-3 mb-6">
      <div
       className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
       }`}
      >
       <Target size={20} className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'} />
      </div>
      <h2
       className={`text-2xl font-semibold animate-fade-in-up ${
        isDarkMode ? 'text-white' : 'text-gray-900'
       }`}
      >
       Goals
      </h2>
     </div>
     <div className="space-y-3">
      {goals.map((goal, index) => (
       <div
        key={goal}
        className={`p-4 rounded-xl animate-fade-in-up ${
         isDarkMode
          ? 'bg-slate-800/50 border border-slate-700'
          : 'bg-gray-50 border border-gray-200'
        }`}
        style={{ animationDelay: `${index * 100 + 200}ms` }}
       >
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
         {goal}
        </p>
       </div>
      ))}
     </div>
    </section>

    {/* Interests Section */}
    <section className="mb-12">
     <div className="flex items-center gap-3 mb-6">
      <div
       className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
       }`}
      >
       <Heart size={20} className={isDarkMode ? 'text-pink-400' : 'text-pink-600'} />
      </div>
      <h2
       className={`text-2xl font-semibold animate-fade-in-up ${
        isDarkMode ? 'text-white' : 'text-gray-900'
       }`}
      >
       Interests
      </h2>
     </div>
     <div className="flex flex-wrap gap-3">
      {interests.map((interest, index) => (
       <span
        key={interest}
        className={`px-4 py-2 rounded-full text-sm animate-fade-in-up ${
         isDarkMode
          ? 'bg-slate-800/50 border border-slate-700 text-gray-300'
          : 'bg-gray-50 border border-gray-200 text-gray-700'
        }`}
        style={{ animationDelay: `${index * 100 + 400}ms` }}
       >
        {interest}
       </span>
      ))}
     </div>
    </section>

    <Footer isDarkMode={isDarkMode} />
   </main>
  </div>
 );
}
