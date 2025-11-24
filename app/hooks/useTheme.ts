'use client';

import { useState, useEffect } from 'react';

type ThemeMode = 'system' | 'light' | 'dark';

export function useTheme() {
 const [themeMode, setThemeMode] = useState<ThemeMode>('system');
 const [isDarkMode, setIsDarkMode] = useState(false);
 const [mounted, setMounted] = useState(false);

 // Load theme from localStorage after mount
 useEffect(() => {
  setMounted(true);
  const savedTheme = localStorage.getItem('theme') as ThemeMode;
  if (savedTheme) {
   setThemeMode(savedTheme);
  }
 }, []);

 useEffect(() => {
  if (!mounted) return;

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
 }, [themeMode, mounted]);

 const setTheme = (theme: ThemeMode) => {
  setThemeMode(theme);
  localStorage.setItem('theme', theme);
 };

 // Return consistent value during SSR
 return { themeMode, isDarkMode: mounted ? isDarkMode : false, setTheme };
}
