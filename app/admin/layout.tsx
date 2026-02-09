import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../lib/auth';
import Link from 'next/link';
import { LayoutDashboard, FileText, Image, LogOut } from 'lucide-react';
import React from 'react';

const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  // Check if user is an admin
  const isAdmin = session.user?.email && adminEmails.includes(session.user.email);
  if (!isAdmin) {
    redirect('/'); // Redirect non-admins to homepage
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 shadow-xl fixed h-full z-20 hidden md:block">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Admin
          </h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/portfolio"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Image size={20} />
            Portfolio
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FileText size={20} />
            Blog
          </Link>
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
             {session.user?.image && (
                <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full" />
             )}
             <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{session.user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
