'use client';

import { useState, useEffect } from 'react';
import {
 Menu,
 X,
 Moon,
 Sun,
 Monitor,
 Github,
 Instagram,
 Linkedin,
} from 'lucide-react';

type ThemeMode = 'system' | 'light' | 'dark';

export default function Home() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [themeMode, setThemeMode] = useState<ThemeMode>('system');
 const [isDarkMode, setIsDarkMode] = useState(true);

 useEffect(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme') as ThemeMode;
  if (savedTheme) {
   setThemeMode(savedTheme);
  }
 }, []);

 useEffect(() => {
  // Handle theme changes
  const updateTheme = () => {
   if (themeMode === 'system') {
    const systemPrefersDark = window.matchMedia(
     '(prefers-color-scheme: dark)'
    ).matches;
    setIsDarkMode(systemPrefersDark);
   } else {
    setIsDarkMode(themeMode === 'dark');
   }
  };

  updateTheme();
  localStorage.setItem('theme', themeMode);

  // Listen for system theme changes when in system mode
  if (themeMode === 'system') {
   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
   const handler = () => updateTheme();
   mediaQuery.addEventListener('change', handler);
   return () => mediaQuery.removeEventListener('change', handler);
  }
 }, [themeMode]);

 const cycleTheme = () => {
  setThemeMode((prev) => {
   if (prev === 'system') return 'light';
   if (prev === 'light') return 'dark';
   return 'system';
  });
 };

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-800' : 'bg-white'
   } transition-colors duration-300`}
  >
   {/* Header */}
   <header className="animate-fade-in">
    <div className="w-full px-6 py-2 flex items-center justify-between">
     <a
      href="/"
      className={`text-lg font-bold ${
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
        onClick={cycleTheme}
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
        onClick={cycleTheme}
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
        onClick={cycleTheme}
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
   <main className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-6">
    {/* Hero Section */}
    <section className="mb-1">
     <h1
      className={`text-4xl font-bold mb-6 ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      } animate-fade-in-up`}
     >
      Hi! I am Mohammad Naufal Maulana
     </h1>

     <div className="mb-2 space-y-4">
      <p
       className={`${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
       } leading-relaxed text-lg animate-fade-in-up animation-delay-200`}
      >
       Aku Mohammad Naufal Maulana, seorang mahasiswa informatika tingkat ketiga
       yang menyukai teknologi. Seorang PC Enthusiast sejak 2020, dan juga
       pengguna Linux Desktop sejak 2023.
      </p>

      <p
       className={`${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
       } leading-relaxed text-lg animate-fade-in-up animation-delay-300`}
      >
       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere
       rhoncus mauris et viverra. Vestibulum metus est, gravida a orci ut,
       tempor dignissim neque. Aliquam pharetra, tortor in vestibulum aliquet,
       lectus nunc molestie nunc, eget scelerisque mauris eros non purus.
       Aliquam efficitur metus ut velit accumsan, rutrum lacinia quam mollis.
       Nulla facilisi. Curabitur vel ex urna. Integer fermentum, libero eu
       commodo rutrum, purus nulla elementum eros, eget blandit tortor dolor at
       lacus. Aliquam eget sollicitudin sem. Nulla eleifend tortor pretium est
       pharetra, non pharetra ipsum faucibus. Integer cursus et magna at varius.
       Nam nec fringilla augue. Ut sem velit, lacinia eget libero a, ornare
       mollis massa. Integer lobortis arcu metus, eu rhoncus nisl viverra
       ullamcorper. Pellentesque sit amet luctus lacus, nec pulvinar diam.
      </p>

      <p
       className={`${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
       } leading-relaxed text-lg animate-fade-in-up animation-delay-400`}
      >
       Aliquam aliquam, massa vel molestie laoreet, metus leo faucibus leo, non
       ornare magna justo dapibus enim. Curabitur efficitur in neque quis
       tincidunt. Integer bibendum ipsum sed porta molestie. Nam laoreet turpis
       tortor, id auctor lectus pretium rhoncus. In commodo libero id laoreet
       pharetra. Integer et massa imperdiet, feugiat elit quis, vulputate dolor.
       Quisque suscipit pellentesque mattis.
      </p>
     </div>
    </section>

    {/* Footer */}
    <footer>
     {/* Social Media Links */}
     <div className="flex items-center animate-fade-in-up animation-delay-400">
      <a
       href="https://github.com/w0pal"
       target="_blank"
       rel="noopener noreferrer"
       className={`p-2 rounded-lg ${
        isDarkMode
         ? 'text-gray-400 hover:text-white hover:bg-slate-700'
         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
       } transition-colors`}
       aria-label="GitHub"
      >
       <Github size={18} />
      </a>
      <a
       href="https://instagram.com/w0pal"
       target="_blank"
       rel="noopener noreferrer"
       className={`p-2 rounded-lg ${
        isDarkMode
         ? 'text-gray-400 hover:text-white hover:bg-slate-700'
         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
       } transition-colors`}
       aria-label="Instagram"
      >
       <Instagram size={18} />
      </a>
      <a
       href="https://linkedin.com/in/w0pal"
       target="_blank"
       rel="noopener noreferrer"
       className={`p-2 rounded-lg ${
        isDarkMode
         ? 'text-gray-400 hover:text-white hover:bg-slate-700'
         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
       } transition-colors`}
       aria-label="LinkedIn"
      >
       <Linkedin size={18} />
      </a>
     </div>
    </footer>
   </main>
  </div>
 );
}
