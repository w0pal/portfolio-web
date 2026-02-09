'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  id: string; // or slug
  endpoint: string; // e.g., '/api/portfolio'
  identifierType?: 'id' | 'slug';
}

export default function DeleteButton({ id, endpoint, identifierType = 'id' }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const url = identifierType === 'id' ? `${endpoint}/${id}` : `${endpoint}/${id}`;
      // Note: Endpoint param should be base like '/api/portfolio'. Then appending id/slug.
      
      const res = await fetch(url, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      router.refresh();
    } catch (error) {
      alert('Error deleting item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  );
}
