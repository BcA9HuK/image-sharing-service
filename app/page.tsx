import { getPublicImages } from './actions/image';
import { ImageGallery } from '@/components/ImageGallery';

export default async function HomePage() {
  const images = await getPublicImages(20, 0, 'recent');

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Обзор изображений</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-400">
            Просматривайте публичные изображения, которыми делится наше сообщество
          </p>
        </div>

        <ImageGallery initialImages={images} initialSortBy="recent" />
      </div>
    </div>
  );
}
