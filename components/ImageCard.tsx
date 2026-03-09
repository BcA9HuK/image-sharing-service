import Link from 'next/link';
import { SanityImage } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/client';

interface ImageCardProps {
  image: SanityImage;
}

export function ImageCard({ image }: ImageCardProps) {
  // Check if it's a GIF by looking at the asset reference
  const assetRef = image.image.asset._ref;
  const isGif = assetRef.includes('-gif');
  
  // For GIFs, use original URL without any transformations to preserve animation
  // For other images, use width and height constraint for optimization
  const imageUrl = isGif 
    ? urlFor(image.image).url() 
    : urlFor(image.image).width(400).height(400).url();

  return (
    <Link href={`/image/${image._id}`} className="group block">
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="aspect-square relative overflow-hidden bg-gray-700 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={image.title}
            loading="lazy"
            className={`group-hover:scale-105 transition-transform duration-200 ${
              isGif 
                ? 'max-w-full max-h-full object-contain' 
                : 'w-full h-full object-cover'
            }`}
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
