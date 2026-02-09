import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../lib/auth';
import AdminNav from './components/AdminNav';
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
      {/* Sidebar Navigation */}
      <AdminNav
        user={{
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
        }}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 pt-18 md:p-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}

