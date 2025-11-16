'use client';

import { useState } from 'react';
import Header from '../components/Header';
import FullscreenMenu from '../components/FullscreenMenu';
import Footer from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

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

   <main className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-6">
    {/* Konten halaman di sini */}
    <p
     className="animate-fade-in-up font-semibold animation-delay-400"
     style={{ color: isDarkMode ? '#c2f0fc' : '#000000' }}
    >
     lagi proses masak, bentar pusing banget bagian ini wkwkkw
    </p>
   </main>
   <Footer isDarkMode={isDarkMode} />
  </div>
 );
}
