'use client';

import { useState, useEffect } from 'react';

type ThemeMode = 'system' | 'light' | 'dark';

export function useTheme() {
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

 const setTheme = (theme: ThemeMode) => {
  setThemeMode(theme);
 };

 return { themeMode, isDarkMode, setTheme };
}
