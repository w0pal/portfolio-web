# Struktur Komponen Portfolio Web

Kode telah direfactor menjadi komponen-komponen yang reusable untuk memudahkan maintenance dan menghindari redundansi.

## 📁 Struktur File

```
app/
├── components/
│   ├── Header.tsx           # Navbar dengan logo, theme toggle, dan menu button
│   ├── FullscreenMenu.tsx   # Fullscreen menu overlay
│   └── Footer.tsx           # Social media links
├── hooks/
│   └── useTheme.ts          # Custom hook untuk mengelola theme (dark/light/system)
└── page.tsx                 # Halaman utama (hanya konten)
```

## 🔧 Cara Menggunakan

### 1. Membuat Halaman Baru

Untuk membuat halaman baru, cukup import komponen yang diperlukan:

```tsx
'use client';

import { useState } from 'react';
import Header from './components/Header';
import FullscreenMenu from './components/FullscreenMenu';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';

export default function NewPage() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { themeMode, isDarkMode, setTheme } = useTheme();

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-800' : 'bg-white'
   } transition-colors duration-300`}
  >
   <Header
    isDarkMode={isDarkMode}
    themeMode={themeMode}
    setTheme={setTheme}
    isMenuOpen={isMenuOpen}
    setIsMenuOpen={setIsMenuOpen}
   />

   <FullscreenMenu
    isDarkMode={isDarkMode}
    isMenuOpen={isMenuOpen}
    setIsMenuOpen={setIsMenuOpen}
   />

   <main className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-6">
    {/* Konten halaman di sini */}
    <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
     Konten Halaman Baru
    </h1>
   </main>

   <Footer isDarkMode={isDarkMode} />
  </div>
 );
}
```

### 2. Komponen-Komponen

#### Header.tsx

- Props: `isDarkMode`, `themeMode`, `setTheme`, `isMenuOpen`, `setIsMenuOpen`
- Berisi: Logo w0pal, theme toggle (system/light/dark), menu button

#### FullscreenMenu.tsx

- Props: `isDarkMode`, `isMenuOpen`, `setIsMenuOpen`
- Berisi: Fullscreen navigation menu dengan links

#### Footer.tsx

- Props: `isDarkMode`
- Berisi: Social media icons (GitHub, Instagram, Threads, LinkedIn)

#### useTheme (Hook)

- Return: `{ themeMode, isDarkMode, setTheme }`
- Mengelola: Tema system/light/dark, localStorage, system preference

## ✨ Keuntungan

1. **No Redundancy**: Navbar, menu, dan footer cukup ditulis sekali
2. **Easy Maintenance**: Update di satu tempat, berlaku di semua halaman
3. **Consistent**: Semua halaman memiliki tampilan yang konsisten
4. **Reusable**: Komponen dapat digunakan di halaman manapun
5. **Clean Code**: Setiap file memiliki tanggung jawab yang jelas

## 🎨 Customization

Untuk mengubah styling atau konten:

- **Logo/Brand**: Edit di `components/Header.tsx`
- **Menu Items**: Edit di `components/FullscreenMenu.tsx`
- **Social Links**: Edit di `components/Footer.tsx`
- **Theme Logic**: Edit di `hooks/useTheme.ts`
