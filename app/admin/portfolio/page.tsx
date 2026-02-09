import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import DeleteButton from '../components/DeleteButton';

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Helper to parse tags
  const parseTags = (tagsStr: string) => {
    try {
      const parsed = JSON.parse(tagsStr);
      return Array.isArray(parsed) ? parsed : [tagsStr];
    } catch {
      return [tagsStr];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add New</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
              <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {items.map((item) => {
              const tags = parseTags(item.tags);
              return (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">{item.title}</td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400 max-w-xs truncate">{item.description}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/portfolio/${item.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteButton id={item.id} endpoint="/api/portfolio" />
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No portfolio items found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {items.map((item) => {
          const tags = parseTags(item.tags);
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-gray-500">+{tags.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/portfolio/${item.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <DeleteButton id={item.id} endpoint="/api/portfolio" />
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No portfolio items found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}

