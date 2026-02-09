'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Image, LogOut, Menu, X } from 'lucide-react';

interface AdminNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AdminNav({ user }: AdminNavProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/portfolio', icon: Image, label: 'Portfolio' },
    { href: '/admin/blog', icon: FileText, label: 'Blog' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-800 shadow-md z-30 flex items-center justify-between px-4 md:hidden">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
          Admin
        </h2>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:z-20
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Admin
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          ))}
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-8"
          >
            <LogOut size={20} />
            Sign Out
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {user?.image && (
              <img src={user.image} alt="User" className="w-10 h-10 rounded-full" />
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
