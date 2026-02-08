'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Monitor, Sun, Moon } from 'lucide-react';

type ThemeMode = 'system' | 'light' | 'dark';

interface HeaderProps {
 isDarkMode: boolean;
 themeMode: ThemeMode;
 setTheme: (theme: ThemeMode) => void;
 isMenuOpen: boolean;
 setIsMenuOpen: (open: boolean) => void;
}

const navLinks = [
 { href: '/', label: 'Home' },
 { href: '/tentang', label: 'About' },
 { href: '/portfolio', label: 'Projects' },
 { href: '/blog', label: 'Posts' },
 { href: '/saat-ini', label: 'Now' },
];

export default function Header({
 isDarkMode,
 themeMode,
 setTheme,
 isMenuOpen,
 setIsMenuOpen,
}: HeaderProps) {
 const pathname = usePathname();

 return (
  <header
   className={`sticky top-0 z-50 animate-fade-in ${
    isDarkMode
     ? 'bg-slate-900/80 border-b border-slate-800'
     : 'bg-white/80 border-b border-gray-100'
   } backdrop-blur-md`}
  >
   <div className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
    {/* Logo */}
    <Link
     href="/"
     className={`flex items-center gap-2 text-xl font-bold transition-opacity hover:opacity-70 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
     }`}
    >
     <span
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
       isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'
      }`}
     >
      W
     </span>
     <span className="hidden sm:inline">w0pal</span>
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center gap-1">
     {navLinks.map((link) => {
      const isActive = pathname === link.href;
      return (
       <Link
        key={link.href}
        href={link.href}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
         isActive
          ? isDarkMode
            ? 'text-white'
            : 'text-gray-900'
          : isDarkMode
          ? 'text-gray-400 hover:text-white'
          : 'text-gray-600 hover:text-gray-900'
        }`}
       >
        {link.label}
       </Link>
      );
     })}
    </nav>

    {/* Right Side Controls */}
    <div className="flex items-center gap-2">
     {/* Theme Toggle - Single Button */}
     <button
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      className={`p-2 rounded-lg transition-colors ${
       isDarkMode
        ? 'text-gray-400 hover:text-white hover:bg-slate-800'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      aria-label="Toggle theme"
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
     >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
     </button>

     {/* Mobile Menu Button */}
     <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className={`md:hidden p-2 rounded-lg ${
       isDarkMode
        ? 'text-gray-300 hover:text-white hover:bg-slate-800'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
      } transition-colors`}
      aria-label="Toggle menu"
     >
      <div className="w-5 h-5 flex flex-col justify-center items-center">
       <span
        className={`block h-0.5 w-5 rounded-sm transition-all duration-300 ease-in-out ${
         isDarkMode ? 'bg-gray-300' : 'bg-gray-700'
        } ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
       />
       <span
        className={`block h-0.5 w-5 rounded-sm transition-all duration-300 ease-in-out my-1 ${
         isDarkMode ? 'bg-gray-300' : 'bg-gray-700'
        } ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
       />
       <span
        className={`block h-0.5 w-5 rounded-sm transition-all duration-300 ease-in-out ${
         isDarkMode ? 'bg-gray-300' : 'bg-gray-700'
        } ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
       />
      </div>
     </button>
    </div>
   </div>
  </header>
 );
}
