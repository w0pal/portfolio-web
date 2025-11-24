'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import FullscreenMenu from '../../components/FullscreenMenu';
import Footer from '../../components/Footer';
import { useTheme } from '../../hooks/useTheme';
import NowPlayingBubble from '../../components/NowPlayingBubble';

export default function NewPage() {
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

   <main className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-6">
    {/* Konten halaman di sini */}
    <h1
     className="text-4xl font-bold mb-6 animate-fade-in-up"
     style={{ color: isDarkMode ? '#c2f0fc' : '#1F2937' }}
    >
     Saat ini
    </h1>
    <section className="mb-8">
     <h2
      className="text-2xl font-semibold mb-4 animate-fade-in-up animation-delay-200"
      style={{ color: isDarkMode ? '#c2f0fc' : '#1F2937' }}
     >
      goal saat ini
     </h2>
     <ul className="list-disc list-inside">
      <li
       className="leading-relaxed text-lg font-normal animate-fade-in-up animation-delay-300"
       style={{ color: isDarkMode ? '#c2f0fc' : '#000000' }}
      >
       lulus kuliah menggunakan linux (jurnal, skripsi, etc)
      </li>
      <li
       className="leading-relaxed text-lg font-normal animate-fade-in-up animation-delay-300"
       style={{ color: isDarkMode ? '#c2f0fc' : '#000000' }}
      >
       konsisten daily photo di instagram
      </li>
     </ul>
     <p
      className="leading-relaxed text-lg font-normal mt-4 animate-fade-in-up animation-delay-400"
      style={{ color: isDarkMode ? '#c2f0fc' : '#000000' }}
     >
      udah gitu aja
     </p>
    </section>
   </main>
   <Footer isDarkMode={isDarkMode} />
  </div>
 );
}
