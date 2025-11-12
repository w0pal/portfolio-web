'use client';

import { useEffect } from 'react';

export default function ThemeColorMeta({
 isDarkMode,
}: {
 isDarkMode: boolean;
}) {
 useEffect(() => {
  // Update all theme-color meta tags
  const metaThemeColors = document.querySelectorAll('meta[name="theme-color"]');
  const color = isDarkMode ? '#1e293b' : '#ffffff';

  metaThemeColors.forEach((meta) => {
   meta.setAttribute('content', color);
  });

  // Also update the status bar style for iOS
  const appleStatusBar = document.querySelector(
   'meta[name="apple-mobile-web-app-status-bar-style"]'
  );
  if (appleStatusBar) {
   appleStatusBar.setAttribute(
    'content',
    isDarkMode ? 'black-translucent' : 'default'
   );
  }
 }, [isDarkMode]);

 return null;
}
