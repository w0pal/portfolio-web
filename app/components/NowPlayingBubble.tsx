'use client';

import { useEffect, useState } from 'react';
import { Music } from 'lucide-react';

interface NowPlayingBubbleProps {
 username: string;
 apiKey: string;
 isDarkMode?: boolean;
}

interface Track {
 name: string;
 artist: string;
 album?: string;
 image?: string;
 url?: string;
 nowplaying?: boolean;
}

export default function NowPlayingBubble({
 username,
 apiKey,
 isDarkMode = false,
}: NowPlayingBubbleProps) {
 const [track, setTrack] = useState<Track | null>(null);
 const [isExpanded, setIsExpanded] = useState(false);

 useEffect(() => {
  const fetchNowPlaying = async () => {
   const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;
   const res = await fetch(url);
   const data = await res.json();
   const recent = data.recenttracks?.track?.[0];
   if (recent && recent['@attr']?.nowplaying) {
    setTrack({
     name: recent.name,
     artist: recent.artist['#text'],
     album: recent.album['#text'],
     image: recent.image?.[2]?.['#text'] || '',
     url: recent.url,
     nowplaying: true,
    });
   } else {
    setTrack(null);
   }
  };
  fetchNowPlaying();
  const interval = setInterval(fetchNowPlaying, 30_000); // update every 30s
  return () => clearInterval(interval);
 }, [username, apiKey]);

 if (!track) return null;

 // Collapsed state - just a small music icon
 if (!isExpanded) {
  return (
   <button
    onClick={() => setIsExpanded(true)}
    className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg border flex items-center justify-center animate-fade-in-up hover:scale-110 transition-all duration-200 ${
     isDarkMode
      ? 'bg-white/95 border-gray-200 hover:bg-white'
      : 'bg-slate-800/95 border-slate-700 hover:bg-slate-800'
    }`}
   >
    <Music size={20} className={isDarkMode ? 'text-slate-800' : 'text-white'} />
   </button>
  );
 }

 // Expanded state - full info
 return (
  <div
   className={`fixed bottom-6 right-6 z-50 shadow-lg rounded-full flex items-center px-4 py-2 gap-2 border animate-fade-in-up ${
    isDarkMode
     ? 'bg-white/95 border-gray-200'
     : 'bg-slate-800/95 border-slate-700'
   }`}
   style={{ minWidth: 200 }}
  >
   <button onClick={() => setIsExpanded(false)} className="flex-shrink-0">
    {track.image ? (
     <img
      src={track.image}
      alt={track.name}
      className="w-8 h-8 rounded-full object-cover"
     />
    ) : (
     <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
      <Music size={16} className="text-gray-600 dark:text-gray-300" />
     </div>
    )}
   </button>
   <div className="flex flex-col flex-1 min-w-0">
    <span
     className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
    >
     Naufal is listening...
    </span>
    <a
     href={track.url}
     target="_blank"
     rel="noopener noreferrer"
     className={`text-sm font-semibold hover:underline truncate ${
      isDarkMode ? 'text-cyan-600' : 'text-cyan-400'
     }`}
     title={track.name}
    >
     {track.name}
    </a>
    <span
     className={`text-xs truncate ${
      isDarkMode ? 'text-gray-700' : 'text-gray-300'
     }`}
     title={track.artist}
    >
     {track.artist}
    </span>
   </div>
  </div>
 );
}
