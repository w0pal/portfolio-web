'use client';

import { useState } from 'react';
import Header from './components/Header';
import FullscreenMenu from './components/FullscreenMenu';
import Footer from './components/Footer';
import ThemeColorMeta from './components/ThemeColorMeta';
import { useTheme } from './hooks/useTheme';

export default function Home() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { themeMode, isDarkMode, setTheme } = useTheme();

 return (
  <div
   className={`min-h-screen ${
    isDarkMode ? 'bg-slate-800' : 'bg-white'
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
   />{' '}
   {/* Main Content */}
   <main className="container mx-auto max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] px-6 py-6">
    {/* Hero Section */}
    <section className="mb-1">
     <h1
      className={`text-4xl font-bold mb-4 ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      } animate-fade-in-up`}
     >
      Hi, I am Mohammad Naufal Maulana!
     </h1>

     <div className="w-full md:w-auto mb-4 animate-fade-in-up animation-delay-200">
      <img
       src="/profile.webp"
       alt="Mohammad Naufal Maulana"
       className="w-48 h-48 md:w-64 md:h-64 rounded-lg object-cover shadow-lg"
      />
     </div>

     <div className="space-y-6">
      <h2
       className={`${
        isDarkMode ? 'text-blue-200' : 'text-blue-900'
       } leading-relaxed text-2xl font-bold animate-fade-in-up animation-delay-200`}
      >
       Seorang mahasiswa informatika tingkat ketiga yang menyukai teknologi dan
       fotografi. Seorang PC Enthusiast sejak 2020, dan juga pengguna Linux
       Desktop sejak 2023. Juga menyukai fotografi melalui media sosial, hingga
       akhirnya menjadi hobi keduaku. Memiliki kemampuan memotret dengan genre
       foto jalanan baik melalui kamera ataupun smartphone.
      </h2>

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

      <h2
       className={`text-2xl font-bold mb-6 ${
        isDarkMode ? 'text-orange-200' : 'text-orange-900'
       } animate-fade-in-up`}
      >
       Rencananya, aku akan memasukkan blog pribadi aku di sini. Namun, nanti
       aja deh. Malas. Sekarang mah lorem ipsum dulu aja buat test.
      </h2>
     </div>
    </section>

    <Footer isDarkMode={isDarkMode} />
   </main>
  </div>
 );
}
