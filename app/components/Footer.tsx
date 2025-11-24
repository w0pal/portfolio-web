'use client';

import { Github, Instagram, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
 isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
 return (
  <footer>
   {/* Social Media Links */}
   <div className="flex justify-center animate-fade-in-up animation-delay-400">
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
     href="mailto:w0palphotos@gmail.com"
     target="_blank"
     rel="noopener noreferrer"
     className={`p-2 rounded-lg ${
      isDarkMode
       ? 'text-gray-400 hover:text-white hover:bg-slate-700'
       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
     } transition-colors`}
     aria-label="email"
    >
     <Mail size={18} />
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
 );
}
