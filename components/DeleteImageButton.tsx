'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteImage } from '@/app/actions/image';

interface DeleteImageButtonProps {
  imageId: string;
}

export function DeleteImageButton({ imageId }: DeleteImageButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteImage(imageId);
      router.push('/profile');
      router.refresh();
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      const errorMessage = error?.message || 'Failed to delete image';
      alert(`Error: ${errorMessage}`);
      setLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-md hover:bg-red-50"
      >
        Удалить
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Вы уверены?</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Удаление...' : 'Да, удалить'}
      </button>
      <button
        onClick={() => setShowConfirm(false)}
        disabled={loading}
        className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Отмена
      </button>
    </div>
  );
}
