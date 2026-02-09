'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Monitor, User, LogOut } from 'lucide-react';
import { navLinks } from '../config/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

type ThemeMode = 'system' | 'light' | 'dark';

interface HeaderProps {
  isDarkMode: boolean;
  themeMode: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

function UserMenu({ isDarkMode }: { isDarkMode: boolean }) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
    );
  }

  if (status === 'unauthenticated') {
    return (
      <button
        onClick={() => signIn()}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isDarkMode
            ? 'bg-slate-800 text-white hover:bg-slate-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        Sign In
      </button>
    );
  }

  const user = session?.user;
  // @ts-expect-error - isAdmin is added in auth options
  const isAdmin = user?.isAdmin;
  // Provider is not directly in session user object usually, need to check how it's passed or infer it.
  // Actually, in the auth.ts I saw:
  // session.user.id = user.id;
  // session.user.isAdmin = adminEmails.includes(user.email || '');
  // Provider isn't explicitly passed to session in the code I saw earlier.
  // I might need to infer it or just say "Logged in". 
  // However, the user asked for "loginnya pakai apa; misalnya github ataupun google".
  // If I can't get it easily, I might skip it or assume based on something else, but 
  // let's look at the image. If image is from googleusercontent, it's google. If githubusercontent, it's github.
  // Or I can just check the `image` URL.
  
  let provider = 'Email';
  if (user?.image?.includes('googleusercontent')) provider = 'Google';
  else if (user?.image?.includes('githubusercontent')) provider = 'GitHub';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block focus:outline-none transition-opacity hover:opacity-80"
        aria-label="User menu"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700"
          />
        ) : (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-gray-300'
                : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}
          >
            <User size={16} />
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className={`
            absolute left-0 top-full mt-2 w-72 max-w-[90vw] rounded-xl shadow-xl border animate-fade-in-up origin-top-left overflow-hidden z-50
            ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700'
                : 'bg-white border-gray-200'
            }
          `}
        >
          <div className="p-4 border-b border-gray-100 dark:border-slate-800">
            <p
              className={`text-sm font-semibold truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {user?.name}
            </p>
            <p
              className={`text-xs truncate ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {user?.email}
            </p>
          </div>
          
          <div className="p-2 space-y-1">
            <div className={`px-2 py-1.5 text-xs rounded-lg flex justify-between items-center ${
                isDarkMode ? 'bg-slate-800/50 text-gray-300' : 'bg-gray-50 text-gray-600'
            }`}>
              <span>Provider</span>
              <span className="font-medium">{provider}</span>
            </div>
             <div className={`px-2 py-1.5 text-xs rounded-lg flex justify-between items-center ${
                isDarkMode ? 'bg-slate-800/50 text-gray-300' : 'bg-gray-50 text-gray-600'
            }`}>
              <span>Role</span>
              <span className={`font-medium ${isAdmin ? 'text-yellow-500' : ''}`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
          </div>

          <div className="p-2 border-t border-gray-100 dark:border-slate-800">
            <button
              onClick={() => signOut()}
              className={`w-full flex items-center gap-2 px-2 py-2 text-sm rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-red-400 hover:bg-slate-800'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
        {/* Left: User Menu (Replacing Logo) */}
        <UserMenu isDarkMode={isDarkMode} />

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
            onClick={() => {
              if (themeMode === 'light') setTheme('dark');
              else if (themeMode === 'dark') setTheme('system');
              else setTheme('light');
            }}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Toggle theme"
            title={`Current: ${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}`}
          >
            {themeMode === 'light' ? (
              <Sun size={18} />
            ) : themeMode === 'dark' ? (
              <Moon size={18} />
            ) : (
              <Monitor size={18} />
            )}
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
