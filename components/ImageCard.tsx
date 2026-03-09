import Link from 'next/link';
import { SanityImage } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/client';

interface ImageCardProps {
  image: SanityImage;
}

export function ImageCard({ image }: ImageCardProps) {
  const imageUrl = urlFor(image.image).width(400).height(400).url();

  return (
    <Link href={`/image/${image._id}`} className="group block">
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="aspect-square relative overflow-hidden bg-gray-700">
          <img
            src={imageUrl}
            alt={image.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="p-2 sm:p-4">
          <h3 className="font-semibold text-white truncate text-sm sm:text-base">{image.title}</h3>
          <div className="mt-1 sm:mt-2 flex items-center justify-between text-xs sm:text-sm text-gray-400">
            <span className="truncate mr-2">от {image.author?.username || 'Неизвестно'}</span>
            <span className="whitespace-nowrap">{image.views} просм.</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
