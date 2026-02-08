'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { navLinks } from '../config/navigation';

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
 const pathname = usePathname();

 return (
  <>
   {/* Backdrop */}
   <div
    className={`fixed inset-0 z-40 transition-opacity duration-300 ${
     isMenuOpen
      ? 'opacity-100 pointer-events-auto'
      : 'opacity-0 pointer-events-none'
    } ${isDarkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm`}
    onClick={() => setIsMenuOpen(false)}
   />

   {/* Slide-in Menu */}
   <div
    className={`fixed top-0 right-0 h-full w-[280px] z-50 transition-transform duration-300 ease-out ${
     isMenuOpen ? 'translate-x-0' : 'translate-x-full'
    } ${
     isDarkMode
      ? 'bg-slate-900 border-l border-slate-800'
      : 'bg-white border-l border-gray-200'
    }`}
   >
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
     <span
      className={`text-lg font-semibold ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      Menu
     </span>
     <button
      onClick={() => setIsMenuOpen(false)}
      className={`p-2 rounded-lg transition-colors ${
       isDarkMode
        ? 'text-gray-400 hover:text-white hover:bg-slate-800'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      aria-label="Close menu"
     >
      <X size={20} />
     </button>
    </div>

    {/* Navigation Links */}
    <nav className="px-4 py-6 space-y-2">
     {navLinks.map((link) => {
      const Icon = link.icon;
      const isActive = pathname === link.href;
      return (
       <Link
        key={link.href}
        href={link.href}
        onClick={() => setIsMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
         isActive
          ? isDarkMode
            ? 'bg-slate-800 text-white'
            : 'bg-gray-100 text-gray-900'
          : isDarkMode
          ? 'text-gray-400 hover:text-white hover:bg-slate-800/50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
       >
        <Icon size={20} />
        <span className="font-medium">{link.label}</span>
       </Link>
      );
     })}
    </nav>
   </div>
  </>
 );
}
