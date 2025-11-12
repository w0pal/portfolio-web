'use client';

import { Menu, X, Monitor, Sun, Moon } from 'lucide-react';

type ThemeMode = 'system' | 'light' | 'dark';

interface HeaderProps {
 isDarkMode: boolean;
 themeMode: ThemeMode;
 setTheme: (theme: ThemeMode) => void;
 isMenuOpen: boolean;
 setIsMenuOpen: (open: boolean) => void;
}

export default function Header({
 isDarkMode,
 themeMode,
 setTheme,
 isMenuOpen,
 setIsMenuOpen,
}: HeaderProps) {
 return (
  <header
   className={`sticky top-0 z-50 animate-fade-in ${
    isDarkMode ? 'bg-slate-800' : 'bg-white'
   } backdrop-blur-sm bg-opacity-95`}
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
    <div className="flex items-center gap-3">
     {/* Theme Toggle */}
     <div
      className={`flex items-center rounded-lg ${
       isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
      } p-1`}
     >
      <button
       onClick={() => setTheme('system')}
       className={`p-1.5 rounded-md transition-all ${
        themeMode === 'system'
         ? isDarkMode
           ? 'bg-slate-600 text-white'
           : 'bg-white text-gray-900 shadow-sm'
         : isDarkMode
         ? 'text-gray-400 hover:text-gray-300'
         : 'text-gray-500 hover:text-gray-700'
       }`}
       aria-label="System theme"
       title="System"
      >
       <Monitor size={18} />
      </button>
      <button
       onClick={() => setTheme('light')}
       className={`p-1.5 rounded-md transition-all ${
        themeMode === 'light'
         ? isDarkMode
           ? 'bg-slate-600 text-white'
           : 'bg-white text-gray-900 shadow-sm'
         : isDarkMode
         ? 'text-gray-400 hover:text-gray-300'
         : 'text-gray-500 hover:text-gray-700'
       }`}
       aria-label="Light theme"
       title="Light"
      >
       <Sun size={18} />
      </button>
      <button
       onClick={() => setTheme('dark')}
       className={`p-1.5 rounded-md transition-all ${
        themeMode === 'dark'
         ? isDarkMode
           ? 'bg-slate-600 text-white'
           : 'bg-white text-gray-900 shadow-sm'
         : isDarkMode
         ? 'text-gray-400 hover:text-gray-300'
         : 'text-gray-500 hover:text-gray-700'
       }`}
       aria-label="Dark theme"
       title="Dark"
      >
       <Moon size={18} />
      </button>
     </div>

     {/* Menu Button */}
     <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className={`p-2 rounded-lg ${
       isDarkMode
        ? 'text-gray-300 hover:text-white hover:bg-slate-700'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
      } transition-colors`}
     >
      {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
     </button>
    </div>
   </div>
  </header>
 );
}
