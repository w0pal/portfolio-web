'use client';

import { X } from 'lucide-react';

interface FullscreenMenuProps {
 isDarkMode: boolean;
 isMenuOpen: boolean;
 setIsMenuOpen: (open: boolean) => void;
}

export default function FullscreenMenu({
 isDarkMode,
 isMenuOpen,
 setIsMenuOpen,
}: FullscreenMenuProps) {
 return (
  <div
   className={`fixed inset-0 z-40 transition-opacity duration-300 ${
    isMenuOpen
     ? 'opacity-100 pointer-events-auto'
     : 'opacity-0 pointer-events-none'
   }`}
  >
   <nav
    className={`absolute inset-0 ${
     isDarkMode ? 'bg-slate-800' : 'bg-white'
    } overflow-y-auto`}
   >
    <div className="w-full px-6 py-2 flex items-center justify-between">
     <a
      href="/"
      className={`text-2xl px-2 font-bold transition-opacity hover:opacity-70 cursor-pointer ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      w0pal
     </a>
     <button
      onClick={() => setIsMenuOpen(false)}
      className={`p-2 rounded-lg ${
       isDarkMode
        ? 'text-gray-300 hover:text-white hover:bg-slate-700'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
      } transition-colors`}
     >
      <X size={24} />
     </button>
    </div>

    <div className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-12 space-y-3">
     <a
      href="/tentang"
      onClick={() => setIsMenuOpen(false)}
      className={`block text-2xl font-semi-bold ${
       isDarkMode
        ? 'text-gray-200 hover:text-white'
        : 'text-gray-800 hover:text-black'
      } transition-colors`}
     >
      Tentang
     </a>
     <a
      href="/saat-ini"
      onClick={() => setIsMenuOpen(false)}
      className={`block text-2xl font-semi-bold ${
       isDarkMode
        ? 'text-gray-200 hover:text-white'
        : 'text-gray-800 hover:text-black'
      } transition-colors`}
     >
      Saat ini
     </a>
     <a
      href="/blog"
      onClick={() => setIsMenuOpen(false)}
      className={`block text-2xl font-semi-bold ${
       isDarkMode
        ? 'text-gray-200 hover:text-white'
        : 'text-gray-800 hover:text-black'
      } transition-colors`}
     >
      Blog
     </a>
     <a
      href="/portfolio"
      onClick={() => setIsMenuOpen(false)}
      className={`block text-2xl font-semi-bold ${
       isDarkMode
        ? 'text-gray-200 hover:text-white'
        : 'text-gray-800 hover:text-black'
      } transition-colors`}
     >
      Portfolio
     </a>
    </div>
   </nav>
  </div>
 );
}
