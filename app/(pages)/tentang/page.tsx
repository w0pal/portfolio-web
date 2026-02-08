'use client';

import { useState } from 'react';
import { Camera, Monitor, Code, MapPin } from 'lucide-react';
import Header from '../../components/Header';
import FullscreenMenu from '../../components/FullscreenMenu';
import Footer from '../../components/Footer';
import ThemeColorMeta from '../../components/ThemeColorMeta';
import { useTheme } from '../../hooks/useTheme';
import NowPlayingBubble from '../../components/NowPlayingBubble';

export default function TentangPage() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { themeMode, isDarkMode, setTheme } = useTheme();

 const interests = [
  {
   icon: Monitor,
   title: 'PC Enthusiast',
   description: 'Sejak 2020, membangun dan mengoptimalkan PC',
  },
  {
   icon: Code,
   title: 'Linux User',
   description: 'Pengguna Linux Desktop sejak 2023',
  },
  {
   icon: Camera,
   title: 'Fotografer',
   description: 'Street photography dengan kamera & smartphone',
  },
 ];

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-900 glow-effect grid-background' : 'bg-white grid-background-light'
   } transition-colors duration-300`}
  >
   <ThemeColorMeta isDarkMode={isDarkMode} />
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
   <NowPlayingBubble
    username={process.env.NEXT_PUBLIC_LASTFM_USERNAME || ''}
    apiKey={process.env.NEXT_PUBLIC_LASTFM_API_KEY || ''}
    isDarkMode={isDarkMode}
   />

   <main className="container mx-auto max-w-[90%] lg:max-w-[70%] xl:max-w-[60%] px-6 py-12 relative z-10">
    {/* Hero Section */}
    <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
     {/* Profile Photo */}
     <div className="animate-scale-in">
      <div
       className={`relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden ${
        isDarkMode ? 'ring-4 ring-slate-700' : 'ring-4 ring-gray-200'
       }`}
      >
       <img
        src="/profile.webp"
        alt="Mohammad Naufal Maulana"
        className="w-full h-full object-cover"
       />
      </div>
     </div>

     {/* Name & Role */}
     <div className="text-center md:text-left">
      <h1
       className={`text-3xl md:text-4xl font-bold mb-2 animate-fade-in-up ${
        isDarkMode ? 'text-white' : 'text-gray-900'
       }`}
      >
       Mohammad Naufal Maulana
      </h1>
      <p
       className={`text-lg mb-3 animate-fade-in-up animation-delay-200 ${
        isDarkMode ? 'text-cyan-400' : 'text-blue-600'
       }`}
      >
       Mahasiswa Informatika
      </p>
      <div
       className={`inline-flex items-center gap-2 text-sm animate-fade-in-up animation-delay-400 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
       }`}
      >
       <MapPin size={14} />
       <span>Indonesia</span>
      </div>
     </div>
    </section>

    {/* About Section */}
    <section className="mb-16">
     <h2
      className={`text-xl font-semibold mb-6 animate-fade-in-up ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      Tentang
     </h2>
     <div
      className={`space-y-4 animate-fade-in-up animation-delay-200 ${
       isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}
     >
      <p className="leading-relaxed">
       Seorang mahasiswa informatika tingkat ketiga yang memiliki passion di bidang 
       teknologi dan fotografi. Perjalanan sebagai PC Enthusiast dimulai sejak 2020, 
       kemudian beralih menjadi pengguna Linux Desktop sejak 2023.
      </p>
      <p className="leading-relaxed">
       Selain teknologi, fotografi menjadi hobi kedua yang bermula dari aktivitas di 
       media sosial. Memiliki ketertarikan khusus pada genre street photography, 
       baik menggunakan kamera maupun smartphone.
      </p>
     </div>
    </section>

    {/* Interests Grid */}
    <section className="mb-16">
     <h2
      className={`text-xl font-semibold mb-6 animate-fade-in-up ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      Minat & Keahlian
     </h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {interests.map((item, index) => {
       const Icon = item.icon;
       return (
        <div
         key={item.title}
         className={`p-6 rounded-xl animate-fade-in-up ${
          isDarkMode
           ? 'bg-slate-800/50 border border-slate-700'
           : 'bg-gray-50 border border-gray-200'
         }`}
         style={{ animationDelay: `${index * 100 + 200}ms` }}
        >
         <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
           isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
          }`}
         >
          <Icon
           size={20}
           className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'}
          />
         </div>
         <h3
          className={`font-medium mb-2 ${
           isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
         >
          {item.title}
         </h3>
         <p
          className={`text-sm ${
           isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
         >
          {item.description}
         </p>
        </div>
       );
      })}
     </div>
    </section>

    <Footer isDarkMode={isDarkMode} />
   </main>
  </div>
 );
}
