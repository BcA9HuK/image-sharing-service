'use client';

import { useState, useEffect } from 'react';
import { ImageCard } from './ImageCard';
import { SanityImage } from '@/lib/sanity/types';

interface ImageGalleryProps {
  initialImages: SanityImage[];
  initialSortBy: 'recent' | 'popular' | 'title';
}

export function ImageGallery({ initialImages, initialSortBy }: ImageGalleryProps) {
  const [images, setImages] = useState<SanityImage[]>(initialImages);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title'>(initialSortBy);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialImages.length === 20);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    // Reset when sort changes
    loadImages(1, sortBy, true);
  }, [sortBy]);

  const loadImages = async (pageNum: number, sort: string, reset: boolean = false) => {
    setLoading(true);
    try {
      const offset = (pageNum - 1) * ITEMS_PER_PAGE;
      const response = await fetch(
        `/api/images?limit=${ITEMS_PER_PAGE}&offset=${offset}&sortBy=${sort}`
      );
      const data = await response.json();
      
      if (reset) {
        setImages(data.images);
      } else {
        setImages(prev => [...prev, ...data.images]);
      }
      
      setHasMore(data.images.length === ITEMS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadImages(page + 1, sortBy);
  };

  return (
    <div>
      {/* Sort Controls */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-400">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-700 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800"
          >
            <option value="recent">Недавние</option>
            <option value="popular">Популярные</option>
            <option value="title">По названию</option>
          </select>
        </div>
        <div className="text-xs sm:text-sm text-gray-400">
          Показано: {images.length} изображений
        </div>
      </div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm sm:text-base px-4">Пока нет изображений. Будьте первым, кто загрузит!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {images.map((image) => (
              <ImageCard key={image._id} image={image} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
