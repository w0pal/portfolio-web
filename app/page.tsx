'use client';

import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function Home() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [isDarkMode, setIsDarkMode] = useState(true);

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-800' : 'bg-white'
   } transition-colors duration-300`}
  >
   {/* Header */}
   <header
    className={`${
     isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'
    } backdrop-blur-sm sticky top-0 z-50 border-b ${
     isDarkMode ? 'border-slate-600' : 'border-gray-300'
    } w-full`}
   >
    <div className="w-full px-6 py-4 flex items-center justify-between">
     <a
      href="/"
      className={`text-lg font-bold ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      w0pal
     </a>
     <div className="flex items-center gap-2">
      <button
       onClick={() => setIsDarkMode(!isDarkMode)}
       className={`p-2 rounded-lg ${
        isDarkMode
         ? 'text-gray-300 hover:text-white hover:bg-slate-600/50'
         : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
       } transition-colors`}
       aria-label="Toggle dark mode"
      >
       {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <button
       onClick={() => setIsMenuOpen(!isMenuOpen)}
       className={`p-2 ${
        isDarkMode
         ? 'text-gray-300 hover:text-white'
         : 'text-gray-700 hover:text-gray-900'
       }`}
      >
       {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
     </div>
    </div>
   </header>

   {/* Sidebar Menu */}
   <div
    className={`fixed inset-0 z-40 transition-opacity duration-300 ${
     isMenuOpen
      ? 'opacity-100 pointer-events-auto'
      : 'opacity-0 pointer-events-none'
    }`}
   >
    <div
     className="absolute inset-0 bg-black/50"
     onClick={() => setIsMenuOpen(false)}
    />
    <nav
     className={`absolute right-0 top-0 h-full w-80 ${
      isDarkMode ? 'bg-slate-700' : 'bg-white'
     } shadow-xl overflow-y-auto`}
    >
     <div className="p-6">
      <button
       onClick={() => setIsMenuOpen(false)}
       className={`absolute top-6 right-6 p-2 ${
        isDarkMode
         ? 'text-gray-300 hover:text-white'
         : 'text-gray-700 hover:text-gray-900'
       }`}
      >
       <X size={24} />
      </button>

      <div className="mt-16 space-y-6">
       <a
        href="#tentang"
        className={`block text-2xl ${
         isDarkMode
          ? 'text-gray-200 hover:text-white'
          : 'text-gray-800 hover:text-black'
        }`}
       >
        Tentang
       </a>
       <a
        href="#saat-ini"
        className={`block text-2xl ${
         isDarkMode
          ? 'text-gray-200 hover:text-white'
          : 'text-gray-800 hover:text-black'
        }`}
       >
        Saat ini
       </a>
       <a
        href="#blog"
        className={`block text-2xl ${
         isDarkMode
          ? 'text-gray-200 hover:text-white'
          : 'text-gray-800 hover:text-black'
        }`}
       >
        Blog
       </a>
      </div>
     </div>
    </nav>
   </div>

   {/* Main Content */}
   <main className="max-w-2xl mx-auto px-6 py-12">
    {/* Hero Section */}
    <section className="mb-16">
     <h1
      className={`text-4xl font-bold mb-8 ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      Hi! I am Mohammad Naufal Maulana
     </h1>

     <div className="mb-12">
      <h2
       className={`${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
       } leading-relaxed mb-6 text-lg`}
      >
       Aku Mohammad Naufal Maulana, seorang mahasiswa informatika tingkat ketiga
       yang menyukai teknologi. Seorang PC Enthusiast sejak 2020, dan juga
       pengguna Linux Desktop sejak 2023.
      </h2>
     </div>
    </section>

    {/* Footer */}
    <footer
     className={`${
      isDarkMode ? 'text-gray-400' : 'text-gray-600'
     } text-sm py-8 border-t ${
      isDarkMode ? 'border-slate-700' : 'border-gray-300'
     }`}
    >
     <div className="mb-4">
      <p className="font-semibold">
       © 2025 Mohammad Naufal Maulana. All Rights Reserved.
      </p>
     </div>
     <div className="flex items-center gap-4">
      <div></div>
     </div>
    </footer>
   </main>
  </div>
 );
}
