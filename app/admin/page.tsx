import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Welcome back, {session?.user?.name}!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select an option from the sidebar to manage your portfolio or blog posts.
        </p>
      </div>
    </div>
  );
}
