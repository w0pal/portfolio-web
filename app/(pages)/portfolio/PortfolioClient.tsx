'use client';

import { useState } from 'react';
import { Folder, ExternalLink } from 'lucide-react';
import Header from '../../components/Header';
import FullscreenMenu from '../../components/FullscreenMenu';
import Footer from '../../components/Footer';
import ThemeColorMeta from '../../components/ThemeColorMeta';
import { useTheme } from '../../hooks/useTheme';
import NowPlayingBubble from '../../components/NowPlayingBubble';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  link: string | null;
  imageUrl: string | null;
  tags: string; // JSON string
  createdAt: Date;
}

interface PortfolioClientProps {
  items: PortfolioItem[];
}

export default function PortfolioClient({ items }: PortfolioClientProps) {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { themeMode, isDarkMode, setTheme } = useTheme();

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
    themeMode={themeMode}
    setTheme={setTheme}
    isMenuOpen={isMenuOpen}
    setIsMenuOpen={setIsMenuOpen}
   />

   <NowPlayingBubble
    username={process.env.NEXT_PUBLIC_LASTFM_USERNAME || ''}
    apiKey={process.env.NEXT_PUBLIC_LASTFM_API_KEY || ''}
    isDarkMode={isDarkMode}
   />

   <main className="container mx-auto max-w-[90%] lg:max-w-[70%] xl:max-w-[60%] px-6 py-12 relative z-10">
    {/* Header */}
    <section className="mb-12">
     <h1
      className={`text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up ${
       isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
     >
      Portfolio
     </h1>
     <p
      className={`text-lg animate-fade-in-up animation-delay-200 ${
       isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}
     >
      Koleksi karya dan project yang pernah kukerjakan.
     </p>
    </section>

    {/* Projects Grid */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
     {items.map((project, index) => {
      let tags: string[] = [];
      try {
       tags = JSON.parse(project.tags);
       if (!Array.isArray(tags)) tags = [project.tags];
      } catch (e) {
       tags = [project.tags]; // Fallback
      }

      return (
      <a
       key={project.id}
       href={project.link || '#'}
       target={project.link ? '_blank' : undefined}
       rel="noopener noreferrer"
       className={`group p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up ${
        isDarkMode
         ? 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
         : 'bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-lg'
       }`}
       style={{ animationDelay: `${index * 100 + 200}ms` }}
      >
       <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
         isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
        }`}
       >
        <Folder
         size={20}
         className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'}
        />
       </div>
       <h3
        className={`text-xl font-semibold mb-2 flex items-center gap-2 ${
         isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
       >
        {project.title}
        {project.link && (
            <ExternalLink
            size={16}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
        )}
       </h3>
       <p
        className={`text-sm mb-4 line-clamp-3 ${
         isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}
       >
        {project.description}
       </p>
       <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
         <span
          key={i}
          className={`px-2 py-1 text-xs rounded-full ${
           isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'
          }`}
         >
          {tag}
         </span>
        ))}
       </div>
      </a>
     );})}
     {items.length === 0 && (
         <div className={`col-span-full text-center py-12 text-gray-400`}>
             No projects found. Check back later!
         </div>
     )}
    </section>

    <div className="mt-12">
     <Footer isDarkMode={isDarkMode} />
    </div>
   </main>
  </div>
 );
}
